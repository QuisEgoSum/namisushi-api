const {createLogger, format, transports} = require('winston')
const {combine, timestamp} = format
const events = require('events')
const ApplicationError = require('libs/error')
const alg = require('libs/alg')
const config = require('@config')


class Logger extends events.EventEmitter {

    constructor() {
        super()

        /**
         * @private
         */
        this.colors = {
            reset: '\x1b[0m',
            info: '\x1b[34m',
            debug: '\x1b[35m',
            warn: '\x1b[33m',
            error: '\x1b[31m',
            fatal: '\x1b[41m\x1b[37m'
        }

        /**
         * @private
         */
        this.storeLogger = {
            info: createLogger(
                {
                    transports: [
                        new transports.File(
                            {
                                filename: config.path.logs + `/info.log`,
                                format: combine(timestamp(), format.json())
                            }
                        )
                    ]
                }
            ),
            debug: createLogger(
                {
                    transports: [
                        new transports.File(
                            {
                                filename: config.path.logs + `/debug.log`,
                                format: combine(timestamp(), format.json()),
                                level: 'debug'
                            }
                        )
                    ]
                }
            ),
            error: createLogger(
                {
                    transports: [
                        new transports.File(
                            {
                                filename: config.path.logs + `/error.log`,
                                format: combine(timestamp(), format.json())
                            }
                        )
                    ]
                }
            )
        }

        /**
         * @private
         */
        this.stringFormatterIgnored = new Set(
            ['message', 'priority', 'stack', 'label']
        )

        /**
         * @private
         */
        this.priorityToLevelConsole = {
            'error': 'error',
            'info': 'log',
            'warn': 'log',
            'fatal': 'error',
            'debug': 'debug'
        }

        /**
         * @private
         */
        this.priorityToLevelWinston = {
            'error': 'error',
            'info': 'info',
            'warn': 'info',
            'fatal': 'error',
            'debug': 'debug'
        }
    }

    error(error, ctx) {
        const logObject = this.errorObjectFormatter(error)

        this.assignCtx(logObject, ctx)

        logObject.priority = 'error'

        this.write(logObject)

        this.emit('error-log', logObject)
    }

    fatal(error, ctx) {
        const logObject = this.errorObjectFormatter(error)

        this.assignCtx(logObject, ctx)

        logObject.priority = 'fatal'

        this.write(logObject)

        this.emit('fatal-log', logObject)
    }

    info(data, ctx) {
        const logObject = this.defaultObjectFormatter(data)

        this.assignCtx(logObject, ctx)

        logObject.priority = 'info'

        this.write(logObject)

        this.emit('info-log', logObject)
    }

    warn(data, ctx) {
        const logObject = this.defaultObjectFormatter(data)

        this.assignCtx(logObject, ctx)

        logObject.priority = 'warn'

        this.write(logObject)

        this.emit('warn-log', logObject)
    }


    debug(data, ctx) {
        const logObject = this.errorObjectFormatter(data)

        this.assignCtx(logObject, ctx)

        logObject.priority = 'debug'

        this.write(logObject)

        this.emit('debug-log', logObject)
    }

    write(logObject) {
        const logString = this.defaultStringFormatter(logObject)

        console[this.priorityToLevelConsole[logObject.priority]](this.colors[logObject.priority] + logString + this.colors.reset)
        this.storeLogger[this.priorityToLevelWinston[logObject.priority]][this.priorityToLevelWinston[logObject.priority]]({...logObject})

        return logString
    }

    assignCtx(logObject, ctx) {
        if (alg.object.isObject(ctx)) {
            alg.object.assignDefaultPropertiesDeep(logObject, ctx)
        } else if (ctx) {
            logObject.ctx = ctx
        }
    }

    /**
     * @private
     */
    defaultObjectFormatter(data) {
        let logObject = {}

        if (
            typeof data === 'string'
            || typeof data === 'number'
            || typeof data === 'boolean'
        ) {
            logObject = {message: data}
        } else if (
            alg.object.isObject(data)
        ) {
            logObject = data

            if (!('message' in logObject)) {
                logObject.message = 'Log object'
            }
        } else if (
            Array.isArray(data)
        ) {
            logObject = {
                message: 'Log array',
                data: data
            }
        } else if (
            data instanceof Set
        ) {
            logObject = {
                message: 'Log Set',
                data: Array.from(data)
            }
        } else if (
            data instanceof Map
        ) {
            logObject = {
                message: 'Log Map',
                data: Array.from(data.entries())
            }
        } else {
            logObject = {
                message: 'Log unknow',
                data: data
            }
        }

        return logObject
    }

    /**
     * @private
     */
    errorObjectFormatter(error) {
        let logObject = {}

        if (error instanceof Error) {
            if (error instanceof ApplicationError) {
                logObject = error.toJSON()
            } else {
                logObject = alg.object.copyingNonEnumerableProperties(error)
            }
            logObject.stack = error.stack
        } else {
            logObject = this.defaultObjectFormatter(error)
        }

        return logObject
    }

    /**
     * @private
     */
    defaultStringFormatter(logObject) {
        let logString = `[${process.pid}][${logObject.priority}]`

        if ('label' in logObject) {
            logString += `[${logObject.label}]`
        }

        if ('stack' in logObject) {
            logString += ' ' + logObject.stack
        } else {
            logString += ' ' + logObject.message
        }

        Object.keys(logObject)
            .forEach(key => {
                if (!this.stringFormatterIgnored.has(key)) {
                    logString += `\n${key}: ${alg.object.isPrimitive(logObject[key]) ? logObject[key] : JSON.stringify(logObject[key], null)}`
                }
            })

        return logString
    }
}


module.exports = new Logger()
