const TelegramBotApi = require('node-telegram-bot-api')
const {configEntity: config, service: configService} = require('core/config')
const logger = require('@logger')


class TelegramBot extends TelegramBotApi {
    constructor() {
        super(
            config.telegram.token,
            {
                polling: true
            }
        )

        this.maxMessageSize = 4096

        this.on('message', this.messageHandler.bind(this))
    }

    async messageHandler(message) {
        try {
            logger.info(
                {
                    message: 'Message from telegram',
                    data: message
                }
            )
        } catch (error) {
            logger.error(error)
        }
    }

    /**
     * @param {String|Array<String>} message
     * @returns {Promise<any>}
     */
    async sendMessageToAdmins(message) {
        if (typeof message === 'string') {
            message = [message]
        }

        const promises = configService.getTelegramAdminIds()
            .map(
                adminTelegramId => message.forEach(
                    message => this
                        .sendMessage(adminTelegramId, message, {parse_mode: 'Markdown'})
                )
            )
            .flat(1)

        return Promise.all(promises)
    }

    /**
     * @param {String|Array<String>} message
     * @returns {Promise<any>}
     */
    async sendMessageToSuperadmins(message) {
        if (typeof message === 'string') {
            message = [message]
        }
        const promises = configService.getTelegramSuperadminIds()
            .map(
                superadminTelegramId => message.map(
                    message => this
                        .sendMessage(superadminTelegramId, message)
                )
            )
            .flat(1)

        return Promise.all(promises)
    }

    /**
     * @param {Array<String>} message
     * @returns {String|Array<String>}
     */
    arrayStringToMessage(message) {
        if (message.reduce((acc, cur) => acc + cur.length, 0) > this.maxMessageSize) {
            const message = []

            let currentMessage = ''

            for (const part of message) {
                if (currentMessage.length + part.length > this.maxMessageSize) {
                    message.push(currentMessage)
                    if (part.length > this.maxMessageSize) {
                        this.splitStringByLength(part, this.maxMessageSize)
                            .forEach((part, index, array) => {
                                if (array.length === index + 1) {
                                    currentMessage = part
                                } else {
                                    message.push(part)
                                }
                            })
                    } else {
                        currentMessage = part
                    }
                } else {
                    currentMessage += part
                }
            }

            message.push(currentMessage)

            return message
        } else {
            return message.join('')
        }
    }

    /**
     * @param {String} string
     * @param {Number} length
     * @returns {Array<String>}
     */
    splitStringByLength(string, length) {
        const strings = []

        for (let start = 0, slices = length; start < string.length; start += length, slices += length) {
            strings.push(string.slice(start, slices))
        }

        return strings
    }
}


module.exports = TelegramBot