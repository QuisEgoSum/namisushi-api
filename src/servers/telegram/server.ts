import {Telegraf, Context} from 'telegraf'
import {config} from '@config'
import {logger as defaultLogger} from '@logger'



export async function createTelegramBot(): Promise<Telegraf> {
  const logger = defaultLogger.child({label: 'telegram'})
  const bot = new Telegraf(config.server.telegram.token)
  bot.on('message', (ctx: Context) => logger.info({evt: 'message', msg: ctx.message}))
  return bot
}