import {BaseService, ServiceError} from '@core/service'
import {BaseRepositoryError} from '@core/repository'
import {UserRole} from '@app/user/UserRole'
import {UserStatus} from '@app/user/UserStatus'
import type {OtpService} from '@app/user/packages/otp'
import {OtpTarget} from '@app/user/packages/otp'
import {UserSession} from '@app/user/UserSession'
import * as error from '@app/user/user-error'
import {escapeStringRegexp} from '@libs/alg/string'
import {config} from '@config'
import {logger} from '@logger'
import {FilterQuery, Types} from 'mongoose'
import {v4} from 'uuid'
import type {DataList} from '@common/data'
import type {IUser} from '@app/user/UserModel'
import type {UserRepository} from '@app/user/UserRepository'
import type * as entities from '@app/user/schemas/entities'
import {UserCredentials} from '@app/user/schemas/entities'
import type {SessionService} from '@app/user/packages/session'


export class UserService extends BaseService<IUser, UserRepository> {

  private static superadminId = '4920737570657261646d696e'

  private logger: typeof logger
  private telegramCache: {watcherIds: number[]; adminIds: number[]}
  public error: ServiceError & typeof error

  constructor(
    userRepository: UserRepository,
    private readonly sessionService: SessionService,
    private readonly otpService: OtpService
  ) {
    super(userRepository)

    this.telegramCache = {
      adminIds: [],
      watcherIds: []
    }

    this.error = {
      EntityExistsError: error.UserExistsError,
      EntityDoesNotExistError: error.UserNotExistsError,
      ...error
    }

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
    const createUser = {
      name: user.name || null,
      email: user.email || null,
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
    return super.findByIdAndUpdate(id, data)
  }

  async upsertSuperadmin() {
    const superadmin = {
      email: config.user.superadmin.email,
      role: UserRole.WATCHER
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

  /**
   * @deprecated
   */
  async getStatusByPhone(phone: string): Promise<UserStatus> {
    const user = await this.repository.findRoleByPhone(phone)
    if (user === null || user.role === UserRole.CUSTOMER) {
      return UserStatus.SIGN_UP
    } else {
      return UserStatus.SIGN_IN
    }
  }

  /**
   * @deprecated
   */
  async sendSignUpOtp(phone: string) {
    const status = await this.getStatusByPhone(phone)
    if (status === UserStatus.SIGN_IN) {
      throw new this.error.UserRegisteredError()
    }
    const lastTimestamp = await this.otpService.findLastTimestamp(phone, OtpTarget.SIGN_IN)
    const sendDif = lastTimestamp && Math.ceil((Date.now() - lastTimestamp) / 1000)
    if (sendDif && sendDif < 60) {
      throw new this.error.SendOtpTimeoutError({message: `Интервал между отправкой сообщений должен быть 60 секунд. Подождите ещё ${60 - sendDif || 1}`})
    }
    //TODO: send code
    return await this.otpService.createCode(phone, OtpTarget.SIGN_IN)
  }

  async signIn(credentials: UserCredentials): Promise<{user: IUser, sessionId: string}> {
    if (!await this.otpService.isExists(credentials.phone, credentials.code, OtpTarget.SIGN_IN)) {
      throw new this.error.InvalidOtpCodeError()
    }
    const setOnInsert: Partial<IUser> = {
      avatar: `#=${v4()}`,
      name: null,
      email: null,
      role: UserRole.USER,
      telegramId: null
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
}