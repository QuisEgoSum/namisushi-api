import {FastifyInstance} from 'fastify'
import {logger as defaultLogger} from '@logger'


const logger = defaultLogger.child({label: 'shutdown'})


export async function shutdown(
  event: string,
  http: FastifyInstance
) {
  logger.info({mgs: 'Shutdown start', event})
  await Promise.all([
    http.close()
  ])
  logger.info({msg: 'Shutdown end', event})
}