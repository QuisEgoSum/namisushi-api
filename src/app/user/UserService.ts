import {BaseService, ServiceError} from '@core/service'
import {BaseRepositoryError} from '@core/repository'
import {UserRole} from '@app/user/UserRole'
import {UserStatus} from '@app/user/UserStatus'
import {OtpTarget} from '@app/user/packages/otp'
import {UserSession} from '@app/user/UserSession'
import * as error from '@app/user/user-error'
import {escapeStringRegexp} from '@libs/alg/string'
import {config} from '@config'
import {FilterQuery, Types} from 'mongoose'
import bcrypt from 'bcrypt'
import type {DataList} from '@common/data'
import type {IUser} from '@app/user/UserModel'
import type {UserRepository} from '@app/user/UserRepository'
import type * as entities from '@app/user/schemas/entities'
import type {SessionService} from '@app/user/packages/session'
import type {OtpService} from '@app/user/packages/otp'


export class UserService extends BaseService<IUser, UserRepository> {

  private static superadminId = '4920737570657261646d696e'

  private static hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
  }

  private static compareHashPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  public error: ServiceError & typeof error

  constructor(
    userRepository: UserRepository,
    private readonly sessionService: SessionService,
    private readonly otpService: OtpService
  ) {
    super(userRepository)

    this.error = {
      EntityExistsError: error.UserExistsError,
      EntityDoesNotExistError: error.UserNotExistsError,
      ...error
    }
  }

  errorHandler<T>(error: Error | BaseRepositoryError): T {
    if (error instanceof BaseRepositoryError.UniqueKeyError) {
      let message
      switch (error.key) {
        case 'username':
          message = 'Пользователь с таким никнеймом уже существует'
          break
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

  async signin(credentials: entities.UserCredentials): Promise<{user: IUser, sessionId: string}> {
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

  async signOut(userId: string | Types.ObjectId, sessionId: string) {
    return this.sessionService.deleteUserSession(userId, sessionId)
  }

  async signOutAllExpect(userId: string | Types.ObjectId, sessionId: string) {
    return this.sessionService.deleteUserSessionsExpect(userId, sessionId)
      .then(result => result.deletedCount)
  }

  async create(user: entities.CreateUser) {
    const createUser = {
      username: user.username,
      email: user.email,
      role: user.role,
      passwordHash: await UserService.hashPassword(user.password)
    }
    return super.create(createUser)
  }

  async findPage(query: entities.FindUsersQueryAdmin): Promise<DataList<IUser>> {
    const filter: FilterQuery<IUser> = {}
    if ('fRole' in query) {
      filter.role = query.fRole
    }
    if (query.mUsername) {
      filter.username = new RegExp(escapeStringRegexp(query.mUsername), 'i')
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

  async updateUserPassword(userId: string | Types.ObjectId, data: entities.UpdateUserPassword): Promise<IUser> {
    const user = await this.findById(userId, {passwordHash: 1})
    if (!user) {
      throw new this.error.EntityDoesNotExistError()
    }
    if (user.passwordHash && !await UserService.compareHashPassword(data.oldPassword, user.passwordHash)) {
      throw new this.error.InvalidPasswordError()
    }
    return this.findByIdAndUpdate(userId, {password: data.password})
  }

  async upsertSuperadmin() {
    const superadmin = {
      username: config.user.superadmin.username,
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

  async existsUser(userId: Types.ObjectId | string) {
    await this.findById(new Types.ObjectId(userId))
  }

  async distinctAdminTelegramIds() {
    return this.repository.distinctAdminTelegramIds()
  }

  async distinctWatcherTelegramIds() {
    return this.repository.distinctWatcherTelegramIds()
  }

  async upsertByPhone(phone: string, name: string): Promise<Types.ObjectId> {
    const user = await this.repository.upsertCustomerByPhone(phone, name)
    return user._id
  }

  async getStatusByPhone(phone: string): Promise<UserStatus> {
    const user = await this.repository.findRoleByPhone(phone)
    if (user === null || user.role === UserRole.CUSTOMER) {
      return UserStatus.SIGN_UP
    } else {
      return UserStatus.SIGN_IN
    }
  }

  async sendSignUpOtp(phone: string) {
    const status = await this.getStatusByPhone(phone)
    if (status === UserStatus.SIGN_IN) {
      throw new this.error.UserRegisteredError()
    }
    const lastTimestamp = await this.otpService.findLastTimestamp(phone, OtpTarget.SIGN_UP)
    const sendDif = lastTimestamp && Math.ceil((Date.now() - lastTimestamp) / 1000)
    if (sendDif && sendDif < 60) {
      throw new this.error.SendOtpTimeoutError({message: `Интервал между отправкой сообщений должен быть 60 секунд. Подождите ещё ${60 - sendDif || 1}`})
    }
    //TODO: send code
    return await this.otpService.createCode(phone, OtpTarget.SIGN_UP)
  }

  async verifyOtp(data: entities.VerifyOtp) {
    if (!await this.otpService.isExists(data.phone, data.code, OtpTarget.SIGN_UP)) {
      throw new this.error.InvalidOtpCodeError()
    }
  }

  async signUp(signup: entities.SignUp) {
    await this.verifyOtp(signup)
    const user = await this.repository.upsertUser({
      name: signup.name,
      phone: signup.phone,
      username: signup.username || null,
      email: signup.email || null,
      role: UserRole.USER,
      passwordHash: await UserService.hashPassword(signup.password)
    })
    await this.otpService.deleteOtp(signup.phone, signup.code, OtpTarget.SIGN_UP)
    return user
  }
}