import {FastifyRequest, RouteOptions} from 'fastify'
import type {User} from '@app/user'
import {UserSession, error as userError} from '@app/user'


declare module 'fastify' {
  interface FastifyRequest {
    session: UserSession
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

export function createSecurityHook({user}: CreateSecurityHookOptions) {
  async function auth(request: FastifyRequest) {
    request.session = await user.service.authorization(request.cookies.sessionId)
    request.log.info(request.session)
  }

  async function optionalAuth(request: FastifyRequest) {
    try {
      request.session = await user.service.authorization(request.cookies.sessionId)
      request.log.info(request.session)
    } catch (error) {
      if (!(error instanceof userError.UserAuthorizationError)) {
        throw error
      }
    }
  }

  async function isAdmin(request: FastifyRequest) {
    if (!request.session?.isAdmin()) {
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