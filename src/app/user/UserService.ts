import {BaseService} from '@core/service'
import {BaseRepositoryError} from '@core/repository'
import {UserRole} from '@app/user/UserRole'
import type {OtpService} from '@app/user/packages/otp'
import {UserSession} from '@app/user/UserSession'
import * as error from '@app/user/user-error'
import * as fs from '@utils/fs'
import {escapeStringRegexp} from '@libs/alg/string'
import {config} from '@config'
import {logger} from '@logger'
import {FilterQuery, Types} from 'mongoose'
import {v4} from 'uuid'
import bcrypt from 'bcrypt'
import type {DataList} from '@common/data'
import type {IUser} from '@app/user/UserModel'
import type {UserRepository} from '@app/user/UserRepository'
import type * as entities from '@app/user/schemas/entities'
import type {SessionService} from '@app/user/packages/session'
import {MultipartFile} from '@fastify/multipart'


export class UserService extends BaseService<IUser, UserRepository, typeof error> {

  private static superadminId = '4920737570657261646d696e'

  private static hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
  }

  private static compareHashPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  private logger: typeof logger
  private telegramCache: {watcherIds: number[]; adminIds: number[]}

  constructor(
    userRepository: UserRepository,
    private readonly sessionService: SessionService,
    private readonly otpService: OtpService
  ) {
    super(userRepository, error)

    this.telegramCache = {
      adminIds: [],
      watcherIds: []
    }

    this.error.EntityExistsError = this.error.UserExistsError
    this.error.EntityDoesNotExistError = this.error.UserNotExistsError

    this.logger = logger.child({label: 'UserService'})
  }

  async reloadTelegramCache() {
    this.logger.info(`Reload cache`)
    const [adminIds, watcherIds] = await Promise.all([
      this.repository.distinctTelegramIdsByRoles(UserRole.ADMIN, UserRole.WATCHER),
      this.repository.distinctTelegramIdsByRoles(UserRole.WATCHER)
    ])
    this.telegramCache.adminIds = adminIds
    this.telegramCache.watcherIds = watcherIds
  }

  getTelegramAdminIds() {
    return this.telegramCache.adminIds
  }

  getTelegramWatcherIds() {
    return this.telegramCache.watcherIds
  }

  errorHandler<T>(error: Error | BaseRepositoryError): T {
    if (error instanceof BaseRepositoryError.UniqueKeyError) {
      let message
      switch (error.key) {
        case 'email':
          message = 'Пользователь с таким адресом электронной почты уже существует'
          break
        case 'phone':
          message = 'Пользователь с таким номером телефона уже существует'
          break
        default:
          message = error.message
      }
      throw new this.error.UserExistsError({message: message, key: error.key})
    } else {
      throw error
    }
  }

  async authorization(sessionId?: string): Promise<UserSession> {
    if (!sessionId) {
      throw new this.error.UserAuthorizationError()
    }
    const session = await this.sessionService.findSessionById(sessionId)
    if (session === null || session.user === null) {
      throw new this.error.UserAuthorizationError()
    }
    return new UserSession(session._id, session.user._id, session.user.role)
  }

  async signOut(userId: string | Types.ObjectId, sessionId: string) {
    return this.sessionService.deleteUserSession(userId, sessionId)
  }

  async signOutAllExpect(userId: string | Types.ObjectId, sessionId: string) {
    return this.sessionService.deleteUserSessionsExpect(userId, sessionId)
      .then(result => result.deletedCount)
  }

  async create(user: entities.CreateUser) {
    const createUser: Partial<IUser> = {
      name: user.name || null,
      email: user.email || null,
      username: user.username || null,
      passwordHash: user.password ? await UserService.hashPassword(user.password) : null,
      role: user.role,
      phone: user.phone
    }
    return super.create(createUser)
  }

  async findPage(query: entities.FindUsersQueryAdmin): Promise<DataList<IUser>> {
    const filter: FilterQuery<IUser> = {}
    if ('fRole' in query) {
      filter.role = query.fRole
    }
    if (query.mEmail) {
      filter.email = new RegExp(escapeStringRegexp(query.mEmail), 'i')
    }
    return this.repository.findPage(
      {
        limit: query.limit,
        page: query.page
      },
      filter,
      null,
      {
        sort: {
          createdAt: query.sCreatedAt
        }
      }
    )
  }

  async findByIdAndUpdate(id: string | Types.ObjectId, data: entities.UpdateUserById | entities.UpdateUser): Promise<IUser> {
    let update: Partial<IUser> = {}
    if ('password' in data && data.password) {
      update.passwordHash = await UserService.hashPassword(data.password)
      delete data.password
    }
    update = {...update, ...data}
    return super.findByIdAndUpdate(id, update)
  }

  async upsertSuperadmin() {
    const superadmin = {
      email: config.user.superadmin.email,
      role: UserRole.WATCHER,
      passwordHash: await UserService.hashPassword(config.user.superadmin.password)
    }

    await this.repository.updateById(
      new Types.ObjectId(UserService.superadminId),
      {$set: superadmin, $setOnInsert: {name: 'Admin', phone: null, telegramId: null}},
      {upsert: true}
    )
  }

  async upsertByPhone(phone: string, name: string): Promise<Types.ObjectId> {
    const user = await this.repository.upsertCustomerByPhone(phone, name)
    return user._id
  }

  async callOtpCode(phone: string): Promise<string> {
    return await this.otpService.callOtpCode(phone)
  }

  private async signInByPassword(credentials: entities.UserCredentialsByPassword): Promise<{user: IUser, sessionId: string}> {
    const user = await this.repository.findByLogin(credentials.login)
    if (!user || user.passwordHash === null) {
      throw new this.error.IncorrectUserCredentials()
    }
    if (!await UserService.compareHashPassword(credentials.password, user.passwordHash)) {
      throw new this.error.IncorrectUserCredentials()
    }
    const session = await this.sessionService.createForUser(user._id)
    return {
      user: user,
      sessionId: session._id
    }
  }

  private async signInByCode(credentials: entities.UserCredentialsByCode): Promise<{user: IUser, sessionId: string}> {
    await this.otpService.verifyCode(credentials.phone, credentials.code)
    const setOnInsert: Partial<IUser> = {
      avatar: `#=${v4()}`,
      role: UserRole.USER,
      name: null,
      email: null,
      telegramId: null,
      username: null,
      passwordHash: null
    }
    const user = await this.repository.upsertUser(credentials.phone, setOnInsert)
    if (user.role === UserRole.CUSTOMER) {
      await this.repository.setUserRole(user._id, UserRole.USER)
      user.role = UserRole.USER
    }
    const session = await this.sessionService.createForUser(user._id)
    return {
      user: user,
      sessionId: session._id
    }
  }

  async signIn(credentials: entities.UserCredentials) {
    if ('code' in credentials && credentials.code !== null) {
      return this.signInByCode(credentials)
    } else {
      return this.signInByPassword(credentials as entities.UserCredentialsByPassword)
    }
  }

  async uploadAvatar(userId: Types.ObjectId, file: MultipartFile): Promise<IUser> {
    const user = await this.findById(userId)
    if (!user.avatar.startsWith('#=')) {
      await fs.deleteFile(config.user.avatar.destination, user.avatar)
    }
    const {filename, filepath} = await fs.createFilepath(
      config.user.avatar.destination,
      file.mimetype.split('/').pop() || 'png'
    )
    await fs.writeFile(filepath, await file.toBuffer())
    await this.repository.setAvatar(userId, filename)
    user.avatar = filename
    return user
  }

  async setAvatar(userId: Types.ObjectId, avatar: string) {
    const user = await this.findById(userId)
    if (!user.avatar.startsWith('#=')) {
      await fs.deleteFile(config.user.avatar.destination, user.avatar)
    }
    await this.repository.setAvatar(userId, avatar)
    user.avatar = avatar
    return user
  }
}