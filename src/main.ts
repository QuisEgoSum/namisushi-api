import 'module-alias/register'
import {createHttpServer} from './servers/http'
import {createConnection} from '@core/database'
import {initDocs} from '@app/docs'
import {initUser} from '@app/user'
import {initProduct} from '@app/product'
import {initOrder} from '@app/order'
import {logger} from '@logger'
import {shutdown} from './shutdown'
import {createTelegramBot} from './servers/telegram'
import {initNotification} from '@app/notification'


(async function main() {
  await createConnection()

  //TODO: launch after init app packages
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

  {
    ['SIGINT', 'SIGTERM']
      .forEach(event => process.once(event, () => shutdown(event, httpServer, telegramBot)))
  }
})()
  .catch(error => {
    logger.fatal(error)
    process.exit(1)
  })