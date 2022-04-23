import {config} from '@config'
import type {FastifyReply, FastifyRequest, RouteOptions} from 'fastify'


declare module 'fastify' {
  interface RouteOptions {
    onSuccessful?: () => Promise<void>
  }
}


export function customHooks(routeOptions: RouteOptions) {
  if (typeof routeOptions.onSuccessful === 'function') {
    if (!routeOptions[config._.onSuccessful]) {
      routeOptions[config._.onSuccessful] = []
    } else if (typeof routeOptions[config._.onSuccessful] === 'function') {
      // @ts-ignore
      routeOptions[config._.onSuccessful] = [routeOptions[config._.onSuccessful]]
    }
    // @ts-ignore
    routeOptions[config._.onSuccessful].push(async function(request: FastifyRequest, reply: FastifyReply) {
      if (reply.raw.statusCode >= 200 && reply.raw.statusCode < 300) {
        //@ts-ignore
        await routeOptions.onSuccessful()
      }
    })
  }
}