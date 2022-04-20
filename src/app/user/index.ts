import {UserModel} from './UserModel'
import {UserRepository} from './UserRepository'
import {UserService} from './UserService'
import {UserSession} from './UserSession'
import {UserRole} from './UserRole'
import * as error from './user-error'
import * as schemas from './schemas'
import {routes} from './routes'
import {initSession, Session} from './packages/session'
import {initOtp, Otp} from '@app/user/packages/otp'
import type {FastifyInstance} from 'fastify'


class User {
  public readonly UserRole: typeof UserRole
  public readonly error: typeof import('./user-error')
  public readonly schemas: typeof import('./schemas')
  public readonly UserSession: typeof UserSession

  constructor(
    public readonly service: UserService,
    public readonly session: Session,
    public readonly otp: Otp
  ) {
    this.UserRole = UserRole
    this.UserSession = UserSession
    this.error = error
    this.schemas = schemas

    this.router = this.router.bind(this)
  }

  async router(fastify: FastifyInstance) {
    await routes(fastify, this.service)
  }
}

export async function initUser(): Promise<User> {
  const session = await initSession()
  const otp = await initOtp()
  const service = new UserService(new UserRepository(UserModel), session.service, otp.service)
  await service.upsertSuperadmin()
  await service.reloadTelegramCache()

  return new User(
    service,
    session,
    otp
  )
}

export {
  error,
  schemas,
  UserRole,
  UserSession
}

export type {
  User,
  UserService
}