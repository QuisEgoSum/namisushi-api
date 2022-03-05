import {FastifyRequest, RouteOptions} from 'fastify'
import type {UserSession} from '@app/user/packages/session/SessionModel'
import type {User} from '@app/user'


declare module 'fastify' {
  interface FastifyRequest {
    session: UserSession
  }
  interface RouteOptions {
    security: {
      auth: boolean,
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
    if (routeOptions.security?.auth) {
      routeOptions.onRequest.unshift(auth)
    }
  }
}