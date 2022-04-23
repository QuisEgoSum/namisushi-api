import 'module-alias/register'
import {initApp} from './init'
import {config} from '@config'
import {logger} from '@logger'
import {promisify} from 'util'
import mongoose from 'mongoose'
import type {TelegramBot} from './servers/telegram'
import type {NotificationEventListener} from '@app/notification'
import type {FastifyInstance} from 'fastify'
import type {Server} from 'socket.io'


(async function main() {
  const {http, bot, notification, ws} = await initApp()

  await listen(http, bot, ws)

  await notification.listener.startApplication()

  {
    ['SIGINT', 'SIGTERM']
      .forEach(event => process.once(event, () => shutdown(event, http, bot, ws, notification.listener)))
  }
})()
  .catch(error => {
    logger.fatal(error)
    setTimeout(() => process.exit(1), 1000)
  })


async function listen(
  http: FastifyInstance,
  bot: TelegramBot,
  ws: Server
) {
  await promisify(http.ready)()
  await http.listen(config.server.http.port, config.server.http.address)
  ws.listen(config.server.ws.port)
  logger.child({label: 'ws'}).info(`Server listening at http://127.0.0.1:${config.server.ws.port}`)
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
      logger.child({label: 'telegram'}).info(`Telegram long polling client started`)
    }
  }
}

async function shutdown(
  event: string,
  http: FastifyInstance,
  bot: TelegramBot,
  ws: Server,
  notification: NotificationEventListener
) {
  const sLogger = logger.child({label: 'shutdown'})
  sLogger.info({mgs: 'Shutdown start', event})
  if (bot) {
    bot.stop()
  }
  const results = await Promise.allSettled([
    notification.shutdownApplication(event),
    http.close(),
    promisify(ws.close.bind(ws))(),
    mongoose.disconnect(),
  ])
  results.forEach(result => result.status === 'rejected' && sLogger.error(result.reason))
  sLogger.info({msg: 'Shutdown end', event})
  process.exit(0)
}