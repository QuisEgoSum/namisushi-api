import {Telegraf, Context} from 'telegraf'
import {config} from '@config'
import {logger as defaultLogger} from '@logger'
import type {TelegramBot} from './index'


export async function createTelegramBot(): Promise<TelegramBot> {
  if (!config.server.telegram.enableBot) {
    return null
  }
  const logger = defaultLogger.child({label: 'telegram'})
  const bot = new Telegraf(config.server.telegram.token)
  bot.on('message', (ctx: Context) => logger.info({evt: 'message', msg: ctx.message}))
  return bot
}