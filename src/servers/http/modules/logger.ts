import {logger} from '@logger'
import {FastifyRequest} from 'fastify'


export const httpLogger = logger.child({
  label: 'http'
}, {serializers: {
    req(request: FastifyRequest) {
      return {
        method: request.method,
        url: request.url,
        ip: request.headers['x-real-ip'],
        body: request.body,
        params: request.params,
        query: request.query
      }
    }
}})