import 'module-alias/register'
import {initApp} from './init'
import {logger} from '@logger'
import {config} from '@config'
import mongoose from 'mongoose'
import {promisify} from 'util'
import type {FastifyInstance} from 'fastify'
import type {TelegramBot} from './servers/telegram'
import type {NotificationEventListener} from '@app/notification'


(async function main() {
  const {http, bot, notification} = await initApp()

  await listen(http, bot)

  await notification.listener.startApplication()

  {
    ['SIGINT', 'SIGTERM']
      .forEach(event => process.once(event, () => shutdown(event, http, bot, notification.listener)))
  }
})()
  .catch(error => {
    logger.fatal(error)
    setTimeout(() => process.exit(1), 1000)
  })


async function listen(
  http: FastifyInstance,
  bot: TelegramBot
) {
  await promisify(http.ready)()
  await http.listen(config.server.http.port, config.server.http.address)
  if (bot) {
    let telegrafOptions = {}
    if (config.server.telegram.enableWebhook) {
      telegrafOptions = config.server.telegram.webhook
    }
    await bot.launch(telegrafOptions)
    if (config.server.telegram.enableWebhook) {
      logger.child({label: 'telegram'}).info(
        `Telegram webhook server listen http://localhost:${
          config.server.telegram.webhook.port} for domain ${
          config.server.telegram.webhook.domain} at path ${
          config.server.telegram.webhook.hookPath}`
      )
    } else {
      logger.child({label: 'telegram'}).info(`Telegram webhook client started`)
    }
  }
}

async function shutdown(
  event: string,
  http: FastifyInstance,
  bot: TelegramBot,
  notification: NotificationEventListener
) {
  const sLogger = logger.child({label: 'shutdown'})
  sLogger.info({mgs: 'Shutdown start', event})
  await notification.shutdownApplication(event)
  if (bot) {
    bot.stop()
  }
  await http.close()
  await mongoose.disconnect()
  sLogger.info({msg: 'Shutdown end', event})
  process.exit(0)
}