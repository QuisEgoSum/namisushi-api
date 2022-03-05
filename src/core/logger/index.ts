import pino from 'pino'
import {config} from '@config'


export const logger = pino({
  level: config.logger.level,
  // depthLimit: 10,
  // redact: ['hostname'],
  formatters: {
    // level: (level: string) => ({level}),
    bindings: () => ({})// default pid and hostname
  },
  timestamp: config.logger.time
    ? config.logger.isoTime
      ? pino.stdTimeFunctions.isoTime
      : pino.stdTimeFunctions.epochTime
    : undefined,
  nestedKey: 'payload',
  transport: config.logger.pretty
    ? ({
        target: 'pino-pretty',
        options: {
          colorize: true
        }
      })
    : undefined
})

config.useLogger(logger)