import {InvalidJsonStructureError, JsonSchemaValidationErrors, NoDataForUpdatingError} from '@error'
import {Schema} from 'openapi-error'
import {error as userError} from '@app/user'


class Response {
  private type: string
  private additionalProperties: boolean
  constructor() {
    this.type = 'object'
    this.additionalProperties = false
  }
}

export class Ok extends Response {
  private description: string
  private properties: Record<string, any>
  private required: string[]

  static fromEntity(schema: Record<string, any>, entity: string): Ok {
    return new Ok(
      {
        [entity]: schema
      },
      [entity]
    )
  }

  constructor(properties: Record<string, any>, required: string[] = []) {
    super()
    this.description = 'Ok'
    this.properties = properties
    this.required = required
  }
}

export class Created extends Response {
  private description: string
  private properties: Record<string, any>
  private required: string[]
  constructor(schema: Record<string, any>, entity: string) {
    super()
    this.description = 'Created'
    this.properties = {
      [entity]: schema
    }
    this.required = [entity]
  }
}

export class MessageResponse {
  private type: string
  private properties: Record<any, any>
  private additionalProperties: boolean
  private required: string[]
  private description: string
  constructor(...messages: string[]) {
    this.description = 'Ok'
    this.type = 'object'
    this.properties = {
      message: {
        type: 'string'
      }
    }
    this.additionalProperties = false
    this.required = ['message']
    if (messages.length > 1) {
      this.properties.message.enum = messages
      this.properties.message.example = messages[0]
    } else {
      this.properties.message.default = messages[0]
      this.properties.message.example = messages[0]
    }
  }
}

export class ErrorResponse {
  private description: string
  private type: string
  private additionalProperties: boolean
  private oneOf: any[]

  static ErrorResponseOne = class ErrorResponse {
    private title: string
    private type: string
    private properties: {error: Schema}
    private additionalProperties: boolean
    private required: string[]


    constructor(schema: Schema) {
      this.title = schema.title
      this.type = 'object'
      this.properties = {
        error: schema
      }
      this.additionalProperties = false
      this.required = ['error']
    }
  }

  get size() {
    return this.oneOf.length
  }

  constructor(description: string, ...oneOfSchemas: Schema[]) {
    this.type = 'object'
    this.description = description
    this.additionalProperties = true
    this.oneOf = []

    oneOfSchemas.map(schema => this.addSchema(schema))
  }

  addSchema(schema: Schema) {
    this.oneOf.push(new ErrorResponse.ErrorResponseOne(schema))
    return this
  }
}

export class Unauthorized extends ErrorResponse {
  constructor() {
    super('Unauthorized', userError.UserAuthorizationError.schema())
  }
}

export class Forbidden extends ErrorResponse {
  constructor(...oneOfSchemas: Schema[]) {
    super('Forbidden', ...oneOfSchemas)
  }

  userForbidden() {
    this.addSchema(userError.UserRightsError.schema())
    return
  }
}

export class BadRequest extends ErrorResponse {
  constructor(...oneOfSchemas: Schema[]) {
    super('Bad request', ...oneOfSchemas)
  }

  bodyErrors() {
    this.addSchema(JsonSchemaValidationErrors.schema())
    this.addSchema(InvalidJsonStructureError.schema())
    return this
  }

  updateError() {
    this.addSchema(NoDataForUpdatingError.schema())
    return this
  }

  paramsErrors() {
    this.addSchema(JsonSchemaValidationErrors.schema())
    return this
  }
}

export class NotFound extends ErrorResponse {
  constructor(...oneOfSchemas: Schema[]) {
    super('Not Found', ...oneOfSchemas)
  }
}

export class DataList {
  private title: string
  private description: string
  private properties: Record<string, any>
  private required: string[]
  private additionalProperties: boolean
  private example?: unknown
  constructor(schema: Record<any, any>) {
    this.title = 'DataList'
    this.description = 'Ok'
    this.properties = {
      total: {
        description: 'Всего данных для этих условий поиска',
        type: 'integer'
      },
      pages: {
        description: 'Количество страниц для этих условий поиска',
        type: 'integer'
      },
      data: {
        type: 'array',
        items: schema
      }
    }
    this.required = ['total', 'pages', 'data']
    this.additionalProperties = false
    if (schema.examples) {
      this.properties.data.example = schema.examples
    }
  }
}