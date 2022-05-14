import {Schema} from 'ajv'
import {declinationOfNumericalNaming} from '@libs/alg/string'


export interface FastifyMultipartSchemaOptions {
  minimum?: number
  maximum?: number
  allowedMimetypes?: string[]
  maximumFileSize?: number
}


const declinationFile: [string, string, string] = ['файл', 'файла', 'файлов']


export class FastifyMultipartSchema {
  private type: 'array'
  private items: Schema
  private errorMessage: Record<string, string>
  private minItems?: number
  private maxItems?: number

  constructor(options: FastifyMultipartSchemaOptions = {}) {
    this.type = 'array'
    this.items = {
      type: 'object',
      properties: {
        mimetype: {
          type: 'string',
          errorMessage: {}
        },
        file: {
          type: 'object',
          properties: {
            bytesRead: {
              type: 'integer',
              errorMessage: {}
            }
          },
          additionalProperties: true
        }
      },
      additionalProperties: true
    }
    this.errorMessage = {}


    if ('minimum' in options && typeof options.minimum === 'number') {
      this.minItems = options.minimum
      if (options.minimum === 1) {
        this.errorMessage.minItems = `Вы должны загрузить файл`
      } else if (options.minimum === options.maximum) {
        this.errorMessage.minItems = `Вы должны загрузить ${options.minimum} ${declinationOfNumericalNaming(options.minimum, declinationFile)}`
      } else {
        this.errorMessage.minItems = `Вы должны загрузить не менее ${options.minimum} ${declinationOfNumericalNaming(options.minimum, declinationFile)}`
      }
    }
    if ('maximum' in options && typeof options.maximum === 'number') {
      this.maxItems = options.maximum
      this.errorMessage.maxItems = `Вы не можете загрузить более ${options.maximum} ${declinationOfNumericalNaming(options.maximum, declinationFile)}`
    }
    if (Array.isArray(options.allowedMimetypes) && options.allowedMimetypes.length) {
      this.items.properties.mimetype.enum = options.allowedMimetypes
      this.items.properties.mimetype.errorMessage.enum = `Недопустимый тип файла. ${
        options.allowedMimetypes.length > 1 ? 'Допустимые' : 'Допустимый'
      } mimetype: ${options.allowedMimetypes.join(', ')}`
    }
    if ('maximumFileSize' in options && typeof options.maximumFileSize === 'number') {
      this.items.properties.file.properties.bytesRead.maximum = options.maximumFileSize
      this.items.properties.file.properties.bytesRead.errorMessage.maximum = `Максимальный допустимый размер файла ${options.maximumFileSize}`
    }
  }
}