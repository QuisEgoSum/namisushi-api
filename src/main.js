require('module-alias/register')
const logger = require('./utils/logger')
const Notification = require('core/notification')
const createHttpServer = require('./servers/http')
const createWsServer = require('./servers/ws')
const db = require('./utils/db')
const config = require('./config')


;(async function main() {
    const response = await db.connect(config.database.credentials.connectionString)
        .catch(error => logger.error(error))

    await db.init()

    logger.info(`Connecting to the database: ${response.connection.name}.`)

    const httpServer = await createHttpServer()

    httpServer
        .ready(error => {
            if (error) {
                logger.error(error)
                throw error
            }

            httpServer.swagger()
        })

    httpServer.listen(config.server.http.port,
        () => logger.info(`Server has been started localhost:${config.server.http.port}`))

    const wsServer = createWsServer()

    wsServer.listen(config.server.ws.port,
        () => logger.info(`Ws server has been started. localhost:${config.server.ws.port}`))

    await Notification.events.startApplication()
        .catch(error => logger.error(error, {label: 'start-application-event'}))
})()
    .catch(error => {
        logger.fatal(error)
        logger.fatal(`Stopping the application after 1000 ms`)
        setTimeout(() => {
            process.exit(1)
        }, 1000)
    })