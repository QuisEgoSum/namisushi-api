import mongoose from 'mongoose'


interface SchemaHelperParams {
  null?: boolean,
  description?: string,
  example?: any,
  default?: any
}


class SchemaHelper {
  static type: string
  static description: string

  type: string | string[]
  description: string
  example: any
  default: any
  errorMessage: {[key in string]: any}

  constructor(params: SchemaHelperParams, constructor: typeof SchemaHelper) {
    this.type = params.null ? [constructor.type, 'null']: constructor.type
    this.description = params.description || constructor.description

    if ('example' in params) {
      this.example = params.example
    }
    if ('default' in params) {
      this.default = params.default
    }

    this.errorMessage = {}
  }
}

interface ObjectIdParams extends SchemaHelperParams {
  entity?: string,
  errorMessage?: string
}

export class ObjectId extends SchemaHelper {
  static type = 'string'
  static description = 'Unique id'
  static descriptionPattern = 'Unique {{stub}} ID'
  static errorPattern = 'Invalid unique {{stub}} ID'

  pattern: string

  constructor(params: ObjectIdParams = {}) {
    params.example = params.example || new mongoose.Types.ObjectId().toHexString()
    params.description = params.description
      ? params.description
      : params.entity
        ? ObjectId.descriptionPattern.replace('{{stub}}', params.entity)
        : ObjectId.description
    super(params, ObjectId)
    this.pattern = '^[0-9a-fA-F]{24}$'
    this.errorMessage.pattern = params.entity
      ? ObjectId.errorPattern.replace('{{stub}}', params.entity)
      : params.errorMessage
        ? params.errorMessage
        : 'Invalid unique ID'
    this.errorMessage.type = this.errorMessage.pattern
  }
}

export class Timestamp extends SchemaHelper {
  static type = 'integer'
  static description = 'Timestamp'

  constructor(params: SchemaHelperParams = {}) {
    params.example = params.example || Date.now()
    super(params, Timestamp)
  }
}