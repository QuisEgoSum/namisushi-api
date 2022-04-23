import {createConnection} from '@core/database'
import {createHttpServer} from './servers/http'
import {createTelegramBot} from './servers/telegram'
import {createWsServer} from './servers/ws'
import {initDocs} from '@app/docs'
import {initUser} from '@app/user'
import {initProduct} from '@app/product'
import {initNotification} from '@app/notification'
import {initOrder} from '@app/order'
import {initFile} from '@app/file'
import {loadModels} from '@utils/loader'
import {logger} from '@logger'


export async function initApp() {
  await createConnection()

  const models = await loadModels()

  models.forEach(
    model => model.once('index', error => error && logger.child({label: 'db'}).error(error))
  )

  const telegramBot = await createTelegramBot()

  const file = await initFile()
  const docs = await initDocs()
  const user = await initUser()

  const wsServer = createWsServer(user)

  const product = await initProduct()
  const notification = await initNotification(telegramBot, wsServer, user)
  const order = await initOrder(product, notification, user)

  const httpServer = createHttpServer(
    {
      routers: [
        docs.router,
        user.router,
        product.router,
        order.router,
        file.router
      ],
      swagger: docs.swagger,
      securityOptions: {
        user: user
      }
    }
  )

  return {
    http: httpServer,
    bot: telegramBot,
    ws: wsServer,
    notification: notification
  }
}