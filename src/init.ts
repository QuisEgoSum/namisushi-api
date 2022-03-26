import {createConnection} from '@core/database'
import {createHttpServer} from './servers/http'
import {createTelegramBot} from './servers/telegram'
import {initDocs} from '@app/docs'
import {initUser} from '@app/user'
import {initProduct} from '@app/product'
import {initNotification} from '@app/notification'
import {initOrder} from '@app/order'


export async function initApp() {
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

  return {
    http: httpServer,
    bot: telegramBot
  }
}