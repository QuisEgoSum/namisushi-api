import {BaseError} from 'openapi-error'
import {InternalError, InvalidJsonStructureError, RequestHandlingError} from '@core/error'
import type {FastifyError, FastifyReply, FastifyRequest} from 'fastify'


declare class SyntaxError extends Error {type?: string}


const INTERNAL_SERVER_ERROR_RESPONSE = new InternalError().toJSON()


export async function errorHandler(error: FastifyError | BaseError | SyntaxError | Record<string, any>, request: FastifyRequest, reply: FastifyReply) {
  let code = 500
  let payload: Record<string, any> | null = null

  if (error instanceof BaseError) {
    code = error.httpCode()
    payload = error.toJSON()
    error = payload
  } else if (error instanceof SyntaxError && error.type === 'entity.parse.failed') {
    code = 400
    payload = new InvalidJsonStructureError({position: error.message}).toJSON()
  } else if (error.message.startsWith('Unexpected token') && error.stack.includes('secure-json-parse')) {
    code = 400
    payload = new InvalidJsonStructureError({
      position: error.message
        .replace('\n', '')
        .replace('  ', ' ')
    }).toJSON()
  } else if ('code' in error && String(error.code).startsWith('FST_ERR')) {
    code = error.statusCode
    payload = new RequestHandlingError({message: error.message})
  }

  if (!reply.sent) {
    reply
      .code(code)
      .type('application/json')
      .send({error: payload || INTERNAL_SERVER_ERROR_RESPONSE})
  }

  if (code >= 500) {
    request.log.error(error)
  } else {
    request.log.debug(error)
  }
}