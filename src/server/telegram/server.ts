import {Telegraf, Context} from 'telegraf'
import {config} from '@config'
import {logger as defaultLogger} from '@logger'
import {Telegram} from './Telegram'
import {User} from '@app/user'


export async function createTelegramBot(user: User): Promise<Telegram> {
  const logger = defaultLogger.child({label: 'telegram'})
  const bot = new Telegraf(config.server.telegram.token)
  bot.on('message', (ctx: Context) => logger.info({evt: 'message', msg: ctx.message}))
  return new Telegram(bot, user.service)
}