import {BaseService} from '@core/service'
import {BaseRepositoryError} from '@core/repository'
import {UserRole} from './UserRole'
import {escapeStringRegexp} from '@libs/alg/string'
import bcrypt from 'bcrypt'
import {FilterQuery, Types} from 'mongoose'
import {config} from '@config'
import {
  IncorrectUserCredentials,
  InvalidPasswordError,
  UserAuthorizationError,
  UserExistsError,
  UserNotExistsError
} from './user-error'
import type {
  CreateUser,
  UpdateUser,
  UpdateUserById,
  UpdateUserPassword,
  FindUsersQueryAdmin,
  UserCredentials, FindUsersQuery, UserPreview
} from './schemas/entities'
import type {UserSession} from './packages/session/SessionModel'
import type {IUser} from './UserModel'
import type {UserRepository} from './UserRepository'
import type {DataList} from '@common/data'
import type {SessionService} from './packages/session/SessionService'


export class UserService extends BaseService<IUser, UserRepository> {

  private static superadminId = '4920737570657261646d696e'

  private static hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
  }

  private static compareHashPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  private sessionService: SessionService

  constructor(userRepository: UserRepository, sessionService: SessionService) {
    super(userRepository)

    this.sessionService = sessionService
    this.Error.EntityNotExistsError = UserNotExistsError
  }

  errorHandler<T>(error: Error | BaseRepositoryError): T {
    if (error instanceof BaseRepositoryError.UniqueKeyError) {
      if (error.key === 'username') {
        throw new UserExistsError({message: 'User with this username already exists'})
      } else {
        throw new UserExistsError({message: 'User with this email address already exists'})
      }
    } else {
      throw error
    }
  }

  async authorization(sessionId?: string): Promise<UserSession> {
    if (!sessionId) {
      throw new UserAuthorizationError()
    }
    const session = await this.sessionService.findSessionById(sessionId)
    if (session === null || session.user === null) {
      throw new UserAuthorizationError()
    }
    return {
      sessionId: session._id,
      userId: session.user._id,
      userRole: session.user.role
    }
  }

  async signin(credentials: UserCredentials): Promise<{user: IUser, sessionId: string}> {
    const user = await this.repository.findByLogin(credentials.login)
    if (!user || user.passwordHash === null) {
      throw new IncorrectUserCredentials()
    }
    if (!await UserService.compareHashPassword(credentials.password, user.passwordHash)) {
      throw new IncorrectUserCredentials()
    }
    const session = await this.sessionService.createForUser(user._id)
    return {
      user: user,
      sessionId: session._id
    }
  }

  async logout(userId: string | Types.ObjectId, sessionId: string) {
    return this.sessionService.deleteUserSession(userId, sessionId)
  }

  async logoutAllExpect(userId: string | Types.ObjectId, sessionId: string) {
    return this.sessionService.deleteUserSessionsExpect(userId, sessionId)
      .then(result => result.deletedCount)
  }

  async create(user: CreateUser) {
    const createUser = {
      username: user.username,
      email: user.email,
      role: user.role,
      passwordHash: await UserService.hashPassword(user.password)
    }
    return super.create(createUser)
  }

  async findPage(query: FindUsersQueryAdmin): Promise<DataList<IUser>> {
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

  async findByIdAndUpdate(id: string | Types.ObjectId, data: UpdateUserById | UpdateUser): Promise<IUser> {
    let update: Partial<IUser> = {}
    if ('password' in data && data.password) {
      update.passwordHash = await UserService.hashPassword(data.password)
      delete data.password
    }
    update = {...update, ...data}
    return super.findByIdAndUpdate(id, update)
  }

  async updateUserPassword(userId: string | Types.ObjectId, data: UpdateUserPassword): Promise<IUser> {
    const user = await this.findById(userId, {passwordHash: 1})
    if (!user) {
      throw new this.Error.EntityNotExistsError()
    }
    if (user.passwordHash && !await UserService.compareHashPassword(data.oldPassword, user.passwordHash)) {
      throw new InvalidPasswordError()
    }
    return this.findByIdAndUpdate(userId, {password: data.password})
  }

  async upsertSuperadmin() {
    const superadmin = {
      username: config.user.superadmin.username,
      email: config.user.superadmin.email,
      role: UserRole.ADMIN,
      passwordHash: await UserService.hashPassword(config.user.superadmin.password)
    }

    await this.repository.updateById(
      new Types.ObjectId(UserService.superadminId),
      superadmin,
      {upsert: true}
    )
  }

  async existsUser(userId: Types.ObjectId | string) {
    await this.findById(new Types.ObjectId(userId))
  }
}