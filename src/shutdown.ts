import {FastifyInstance} from 'fastify'
import {logger as defaultLogger} from '@logger'
import {Telegraf} from 'telegraf'


const logger = defaultLogger.child({label: 'shutdown'})


export async function shutdown(
  event: string,
  http: FastifyInstance,
  bot: Telegraf
) {
  logger.info({mgs: 'Shutdown start', event})
  bot.stop()
  await http.close()
  logger.info({msg: 'Shutdown end', event})
}