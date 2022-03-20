import {Telegraf} from 'telegraf'
import {config} from '@config'
import {logger as defaultLogger} from '@logger'



export async function createTelegramBot(): Promise<Telegraf | null> {
  if (!config.server.telegram.enable) {
    return null
  }
  const logger = defaultLogger.child({label: 'telegram'})

  const bot = new Telegraf(config.server.telegram.token)

  await bot.launch({
    webhook: {
      domain: config.server.telegram.host,
      port: config.server.telegram.port,
      hookPath: config.server.telegram.path
    }
  })

  bot.on('message', ctx => {
    logger.info({msg: ctx.editedMessage, chat: ctx.message.chat.id})
  })

  return bot
}