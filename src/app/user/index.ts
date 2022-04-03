import {UserModel} from './UserModel'
import {UserRepository} from './UserRepository'
import {UserService} from './UserService'
import {routes} from './routes'
import {initSession} from './packages/session'
import * as error from './user-error'
import * as schemas from './schemas'
import {UserRole} from './UserRole'
import {Types} from 'mongoose'
import type {FastifyInstance} from 'fastify'
import type {Session} from './packages/session'
import {initOtp, Otp} from '@app/user/packages/otp'


class User {
  public readonly UserRole: typeof UserRole
  public readonly error: typeof import('./user-error')
  public readonly schemas: typeof import('./schemas')

  constructor(
    public readonly service: UserService,
    public readonly session: Session,
    public readonly otp: Otp
  ) {
    this.UserRole = UserRole
    this.error = error
    this.schemas = schemas

    this.router = this.router.bind(this)
  }

  async router(fastify: FastifyInstance) {
    await routes(fastify, this.service)
  }

  //TODO: remove this method
  /**
   * @deprecated
   */
  async authorization(sessionId: string) {
    return this.service.authorization(sessionId)
  }
}

export async function initUser(): Promise<User> {
  const session = await initSession()
  const otp = await initOtp()
  const service = new UserService(new UserRepository(UserModel), session.service, otp.service)
  await service.upsertSuperadmin()

  return new User(
    service,
    session,
    otp
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