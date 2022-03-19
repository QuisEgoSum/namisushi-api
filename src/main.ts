import 'module-alias/register'
import {createHttpServer} from './servers/http'
import {createConnection} from '@core/database'
import {initDocs} from '@app/docs'
import {initUser} from '@app/user'
import {initProduct} from '@app/product'
import {initOrder} from '@app/order'
import {promisify} from 'util'
import {config} from '@config'
import {logger} from '@logger'


(async function main() {
  await createConnection()

  const docs = await initDocs()
  const user = await initUser()
  const product = await initProduct()
  const order = await initOrder(product.service)

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

  await promisify(httpServer.ready)()

  await httpServer.listen(config.server.http.port, config.server.http.address)
})()
  .catch(error => {
    logger.fatal(error)
    process.exit(1)
  })