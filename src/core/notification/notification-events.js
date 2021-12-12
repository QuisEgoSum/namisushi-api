const telegramBot = require('bot')
const notificationUtils = require('./notification-utils')
const {events: orderEvents} = require('core/order')
const logger = require('@logger')
const config = require('@config')
const alg = require('libs/alg')
const os = require('os')


class NotificationEvents {
    constructor() {
        orderEvents
            .onNewOrder(this.newOrderEventHandler.bind(this))

        /**
         * @private
         */
        this.stringFormatterIgnored = new Set(
            ['message', 'stack']
        )

        logger
            .on('error-log', this.errorEventHandler.bind(this))
            .on('fatal-log', this.fatalEventHandler.bind(this))
    }

    async startApplication() {
        const message = 'Application started\n\n'
            + `local network:\n`
            + ` - http: 127.0.0.1:${config.server.http.port}\n`
            + ` - ws: 127.0.0.1:${config.server.ws.port}\n\n`
            + `Domain: ${config.server.http.protocol}://${config.server.domain}\n\n`
            + `OS:\n`
            + `- hostname: ${os.hostname()}\n`
            + `- platform: ${os.platform()}\n`
            + `- release: ${os.release()}\n`
            + `- version: ${os.version()}\n`
            + `- cpus ${os.cpus().length} ${os.cpus()[0].model}\n`
            + `- arch: ${os.arch()}\n`
            + `- homedir: ${os.homedir()}\n`
            + (os.networkInterfaces().eth0
                ? `- public network: ${os.networkInterfaces().eth0[0].address}\n`
                : '')
            + `- memory:\n`
            + ` - total: ${os.totalmem()}\n`
            + ` - free: ${os.freemem()}\n`
            + `- load ${os.loadavg().join('|')}`

        return telegramBot.sendMessageToSuperadmins(message)
    }

    /**
     * @param {OrderPopulated} order
     */
    async newOrderEventHandler(order) {
        try {
            await telegramBot.sendMessageToAdmins(
                notificationUtils.orderToMessage(order)
            )
        } catch (error) {
            logger.fatal(error)
        }
    }

    async errorEventHandler(logObject) {
        try {
            await telegramBot.sendMessageToSuperadmins(
                this.unHeaderStringFormatter('Nami Server Error Notification\n', logObject)
            )
        } catch (error) {
            console.dir(logObject, {depth: 100})
            logger.fatal(error)
        }
    }

    async fatalEventHandler(logObject) {
        try {
            await telegramBot.sendMessageToSuperadmins(
                this.unHeaderStringFormatter('Nami Server Fatal Notification\n', logObject)
            )
        } catch (error) {
            console.dir(logObject, {depth: 100})
        }
    }

    unHeaderStringFormatter(header, logObject) {
        const message = [header]

        if ('stack' in logObject) {
            message.push('\n' + logObject.stack)
        } else {
            message.push('\n' + logObject.message)
        }

        message.push('\n')

        Object.keys(logObject)
            .forEach(key => {
                if (!this.stringFormatterIgnored.has(key)) {
                    message.push(`\n${key}: ${alg.object.isPrimitive(logObject[key]) ? logObject[key] : JSON.stringify(logObject[key], null)}`)
                }
            })

        return telegramBot.arrayStringToMessage(message)
    }
}


module.exports = new NotificationEvents()