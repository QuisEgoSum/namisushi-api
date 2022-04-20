import {FastifyReply, FastifyRequest, RouteOptions} from 'fastify'


declare module 'fastify' {
  interface RouteOptions {
    onSuccessful?: () => Promise<void>
  }
}


export function customHooks(routeOptions: RouteOptions) {
  if (typeof routeOptions.onSuccessful === 'function') {
    if (!routeOptions.onResponse) {
      routeOptions.onResponse = []
    } else if (typeof routeOptions.onResponse === 'function') {
      routeOptions.onResponse = [routeOptions.onResponse]
    }
    routeOptions.onResponse.push(async function(request: FastifyRequest, reply: FastifyReply) {
      if (reply.raw.statusCode >= 200 && reply.raw.statusCode < 300) {
        //@ts-ignore
        await routeOptions.onSuccessful()
      }
    })
  }
}