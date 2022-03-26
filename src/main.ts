import 'module-alias/register'
import {initApp} from './init'
import {TelegramBot} from './servers/telegram'
import {logger} from '@logger'
import {config} from '@config'
import {promisify} from 'util'
import type {FastifyInstance} from 'fastify'


(async function main() {
  const {http, bot} = await initApp()

  await listen(http, bot)

  {
    ['SIGINT', 'SIGTERM']
      .forEach(event => process.once(event, () => shutdown(event, http, bot)))
  }
})()
  .catch(error => {
    logger.fatal(error)
    process.exit(1)
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
  bot: TelegramBot
) {
  const sLogger = logger.child({label: 'shutdown'})
  sLogger.info({mgs: 'Shutdown start', event})
  if (bot) {
    bot.stop()
  }
  await http.close()
  sLogger.info({msg: 'Shutdown end', event})
}