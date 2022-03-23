import 'module-alias/register'
import {createHttpServer} from './servers/http'
import {createTelegramBot} from './servers/telegram'
import {createConnection} from '@core/database'
import {initDocs} from '@app/docs'
import {initUser} from '@app/user'
import {initProduct} from '@app/product'
import {initOrder} from '@app/order'
import {initNotification} from '@app/notification'
import {shutdown} from './shutdown'
import {logger} from '@logger'
import {config} from '@config'
import {promisify} from 'util'
import type {FastifyInstance} from 'fastify'
import type {Telegraf} from 'telegraf'


(async function main() {
  await createConnection()

  const telegramBot = await createTelegramBot()

  const docs = await initDocs()
  const user = await initUser()
  const product = await initProduct()
  const notification = await initNotification(telegramBot, user)
  const order = await initOrder(product, notification)

  const httpServer = await createHttpServer(
    {
      routers: [
        docs.router,
        user.router,
        product.router,
        order.router
      ],
      swagger: docs.swagger,
      securityOptions: {
        user: user
      }
    }
  )

  await listen(httpServer, telegramBot)

  {
    ['SIGINT', 'SIGTERM']
      .forEach(event => process.once(event, () => shutdown(event, httpServer, telegramBot)))
  }
})()
  .catch(error => {
    logger.fatal(error)
    process.exit(1)
  })


async function listen(
  http: FastifyInstance,
  bot: Telegraf
) {
  await promisify(http.ready)()
  await http.listen(config.server.http.port, config.server.http.address)
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