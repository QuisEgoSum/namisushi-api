import {FastifyRequest, RouteOptions} from 'fastify'
import type {UserSession} from '@app/user/packages/session/SessionModel'
import type {User} from '@app/user'

declare module 'fastify' {
  interface FastifyRequest {
    session: UserSession | {sessionId: null, userId: null, userRole: null}
  }
  interface RouteOptions {
    security: {
      auth: boolean | 'OPTIONAL',
      admin?: boolean
    }
  }
}

export interface CreateSecurityHookOptions {
  user: User
}


export async function createSecurityHook({user}: CreateSecurityHookOptions) {
  async function auth(request: FastifyRequest) {
    request.session = await user.authorization(request.cookies.sessionId)
    request.log.info(request.session)
  }

  async function optionalAuth(request: FastifyRequest) {
    try {
      request.session = await user.authorization(request.cookies.sessionId)
      request.log.info(request.session)
    } catch {
      request.session = {sessionId: null, userId: null, userRole: null}
    }
  }

  async function isAdmin(request: FastifyRequest) {
    if (request.session?.userRole !== user.UserRole.ADMIN) {
      throw new user.error.UserRightsError()
    }
  }

  return function securityHook(routeOptions: RouteOptions) {
    if (!routeOptions.onRequest) {
      routeOptions.onRequest = []
    } else if (typeof routeOptions.onRequest === 'function') {
      routeOptions.onRequest = [routeOptions.onRequest]
    }
    if (routeOptions.security?.admin) {
      routeOptions.onRequest.unshift(isAdmin)
    }
    if (routeOptions.security?.auth == true) {
      routeOptions.onRequest.unshift(auth)
    } else if (routeOptions.security?.auth === 'OPTIONAL') {
      routeOptions.onRequest.unshift(optionalAuth)
    }
  }
}