import {UserModel} from './UserModel'
import {UserRepository} from './UserRepository'
import {UserService} from './UserService'
import {routes} from './routes'
import {initSession} from './packages/session'
import * as error from './user-error'
import * as schemas from './schemas'
import {UserRole, UserRole as UserRoleEnum} from './UserRole'
import {Types} from 'mongoose'
import type {FastifyInstance} from 'fastify'
import type {Session} from './packages/session'


class User {
  private readonly service: UserService
  private readonly session: Session
  public readonly UserRole: typeof UserRoleEnum
  public readonly error: typeof import('./user-error')
  public readonly schemas: typeof import('./schemas')

  constructor(
    service: UserService,
    UserRole: typeof UserRoleEnum,
    error: typeof import('./user-error'),
    schemas: typeof import('./schemas'),
    session: Session
  ) {
    this.service = service
    this.UserRole = UserRole
    this.error = error
    this.schemas = schemas
    this.session = session

    this.router = this.router.bind(this)
  }

  async router(fastify: FastifyInstance) {
    await routes(fastify, this.service)
  }

  async authorization(sessionId: string) {
    return this.service.authorization(sessionId)
  }

  async existsUser(userId: Types.ObjectId | string) {
    await this.service.existsUser(userId)
  }
}

export async function initUser(): Promise<User> {
  const Session = await initSession()
  const service = new UserService(new UserRepository(UserModel), Session.service)
  await service.upsertSuperadmin()

  return new User(
    service,
    UserRole,
    error,
    schemas,
    Session
  )
}

export {
  error,
  schemas,
  UserRole
}

export type {
  User
}