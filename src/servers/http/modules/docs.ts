import type {RouteOptions} from 'fastify'
import {ErrorResponse, Unauthorized, BadRequest, Forbidden, Ok, Created} from '@common/schemas/response'
import {RequestHandlingError} from '@error'


declare module 'fastify' {
  interface RouteOptions {
    schema?: {
      summary?: string
      tags?: string[]
      response?: {
        //TODO: remove any
        [200]?: Ok | any
        [201]?: Created | any
        [400]?: ErrorResponse
        [401]?: ErrorResponse
        [403]?: Forbidden
        [404]?: ErrorResponse
        [key: string]: any
      },
      security?: Array<{[key: string]: []}>
      params?: Record<string, any>
      [key: string]: any
    }
  }
}


export function createDocsHook() {
  return function docsHook(routeOptions: RouteOptions) {
    if (!routeOptions.schema) {
      routeOptions.schema = {}
    }
    if (!routeOptions.schema.security) {
      routeOptions.schema.security = []
    }
    if (!routeOptions.schema.response) {
      routeOptions.schema.response = {}
    }
    if (!routeOptions.schema.response[400]) {
      routeOptions.schema.response[400] = new BadRequest()
    }
    if (!routeOptions.schema.response[403]) {
      routeOptions.schema.response[403] = new Forbidden()
    }

    routeOptions.schema.response[400].addSchema(new RequestHandlingError().schema())

    if (routeOptions.security?.auth === true) {
      routeOptions.schema.security.push({UserSession: []})
      routeOptions.schema.response[401] = new Unauthorized()
    }
    if (routeOptions.security?.admin) {
      routeOptions.schema.response[403].userForbidden()
    }
    if (!routeOptions.schema.response[403].size) {
      delete routeOptions.schema.response[403]
    }
  }
}