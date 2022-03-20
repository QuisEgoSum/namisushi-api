import {Telegraf, Context} from 'telegraf'
import {config} from '@config'
import {logger as defaultLogger} from '@logger'



export async function createTelegramBot(): Promise<Telegraf> {
  let telegrafOptions = {}
  if (config.server.telegram.enableWebhook) {
    telegrafOptions = config.server.telegram.webhook
  }
  const logger = defaultLogger.child({label: 'telegram'})
  const bot = new Telegraf(config.server.telegram.token)
  await bot.launch(telegrafOptions)
  bot.on('message', (ctx: Context) => logger.info({evt: 'message', msg: ctx.message}))
  return bot
}