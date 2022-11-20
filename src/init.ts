import {createConnection} from '@core/database'
import {createHttpServer} from './server/http'
import {createTelegramBot} from './server/telegram'
import {createWsServer} from './server/ws'
import {initDocs} from '@app/docs'
import {initUser} from '@app/user'
import {initProduct} from '@app/product'
import {initNotification} from '@app/notification'
import {initOrder} from '@app/order'
import {initFile} from '@app/file'
import {initConfig} from '@app/config'
import {loadModels} from '@utils/loader'
import {logger} from '@logger'


export async function initApp() {
  await createConnection()

  const models = await loadModels()

  models.forEach(
    model => model.once('index', error => error && logger.child({label: 'db'}).error(error))
  )

  const [
    file,
    docs,
    user,
    applicationConfig
  ] = await Promise.all([
    initFile(),
    initDocs(),
    initUser(),
    initConfig()
  ])

  const telegram = await createTelegramBot(user)
  const product = await initProduct()

  const wsServer = createWsServer(user)

  const notification = await initNotification(telegram, wsServer, user)
  const order = await initOrder(product, notification, user, telegram)

  const httpServer = createHttpServer(
    {
      routers: [
        docs.router,
        user.router,
        product.router,
        order.router,
        file.router,
        applicationConfig.router
      ],
      swagger: docs.swagger,
      securityOptions: {
        user: user
      }
    }
  )

  return {
    http: httpServer,
    bot: telegram,
    ws: wsServer,
    notification: notification
  }
}