import OpenapiError from 'openapi-error'


export const EntityDoesNotExistError = OpenapiError.compile(
  {
    httpCode: 404
  },
    {
      error: 'EntityNotExists',
      message: 'Не найдено',
      code: 1000
    }
)

export const JsonSchemaValidationError = OpenapiError.compile(
  {
    properties: {
      message: {
        type: 'string',
        example: 'Описание ошибки'
      },
      keyword: {
        type: 'string',
        example: 'type',
        enum: ["type", "minLength", "maxLength", "minimum", "maximum", "regex", "pattern"]
      },
      schemaPath: {
        type: 'string',
        example: '#/properties/name/minLength'
      },
      dataPath: {
        type: 'string',
        example: '/name'
      },
      details: {
        type: 'object',
        oneOf: [
          {
            title: 'Minimum example',
            type: 'object',
            properties: {
              limit: {
                type: 'integer',
                example: 1
              }
            },
            additionalProperties: false
          },
          {
            title: 'Required property example',
            type: 'object',
            properties: {
              missingProperty: {
                type: 'string',
                example: 'name'
              }
            },
            additionalProperties: false
          }
        ]
      }
    },
    additionalProperties: false,
    required: ['message', 'code', 'error']
  },
  {
    error: 'JsonSchemaValidationError',
    code: 1002
  }
)

export const JsonSchemaValidationErrors = OpenapiError.compile(
  {
    httpCode: 400,
    properties: {
      in: {
        type: 'string',
        example: 'body',
        enum: ['body', 'params', 'querystring']
      },
      errors: {
        type: 'array',
        items: JsonSchemaValidationError.schema()
      }
    },
    required: ['errors', 'in']
  },
    {
      error: 'JsonSchemaValidationErrors',
      message: 'Невалидные данные',
      code: 1001
    }
)

export const InvalidDataError = OpenapiError.compile(
  {
    httpCode: 400
  },
    {
      error: 'InvalidDataError',
      message: 'Невалидные данные',
      code: 1003
    }
)

export const AccessError = OpenapiError.compile(
  {
    httpCode: 403
  },
    {
      error: 'AccessError',
      message: 'У вас не достаточно прав для выполнения этого действия',
      code: 1004
    }
)

export const AuthorizationError = OpenapiError.compile(
  {
    httpCode: 401
  },
    {
      error: 'AuthorizationError',
      message: 'Вы не авторизованы',
      code: 1005
    }
)

export const UnprocessableEntityError = OpenapiError.compile(
  {
    httpCode: 422
  },
    {
      error: 'UnprocessableEntityError',
      message: 'Unprocessable Entity',
      code: 1006
    }
)

export const UniqueKeyError = OpenapiError.compile(
  {
    httpCode: 400,
    properties: {
      key: {
        type: 'string'
      },
      value: {
        type: 'string'
      }
    },
    required: ['key', 'value']
  },
    {
      error: 'UniqueKeyError',
      message: 'Unique key error',
      code: 1007
    }
)

export const EntityExistsError = UniqueKeyError.extends(
  {},
  {
    error: 'EntityExistsError',
    message: 'Уже существует',
    code: 1008
  }
)

export const NoDataForUpdatingError = InvalidDataError.extends(
  {},
  {
    error: 'NoDataForUpdatingError',
    message: 'Отсутствуют данные для обновления',
    code: 1009
  }
)

export const InternalError = OpenapiError.compile(
  {
    httpCode: 500
  },
  {
    error: 'InternalError',
    message: 'Internal Server Error',
    code: 1010
  }
)

export const TooEarlyError = OpenapiError.compile(
  {
    httpCode: 425
  },
  {
    error: 'TooEarlyError',
    message: 'Too early',
    code: 1011
  }
)

export const InvalidJsonStructureError = InvalidDataError.extends(
  {
    properties: {
      position: {
        type: 'string'
      }
    }
  },
  {
    error: 'InvalidJsonStructureError',
    message: 'Тело содержит невалидную JSON структуру',
    code: 1012
  }
)

export const WaitingTimeExceededError = InternalError.extends(
  {},
  {
    error: 'WaitingTimeExceededError',
    message: 'Время ожидания превышено',
    code: 1013
  }
)

export const RouteNotFoundError = OpenapiError.compile(
  {
    properties: {
      method: {
        type: 'string',
        enum: ['GET', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']
      },
      url: {
        type: 'string'
      }
    },
    required: ['method', 'url']
  },
  {
    error: 'RouteNotFoundError',
    message: 'Конечная точка не найдена',
    code: 1014
  }
)

export const RequestHandlingError = InvalidDataError.extends(
  {
    properties: {
      message: {
        description: 'Несколько примеров сообщений',
        type: 'string',
        default: 'Body cannot be empty when content-type is set to \'application/json\'',
        oneOf: [
          {
            title: 'FST_ERR_CTP_EMPTY_JSON_BODY',
            type: 'string',
            default: 'Body cannot be empty when content-type is set to \'application/json\''
          },
          {
            title: 'FST_ERR_CTP_INVALID_MEDIA_TYPE',
            type: 'string',
            default: 'Unsupported Media Type: application/octet-stream'
          }
        ]
      }
    }
  },
  {
    code: 1015,
    error: 'RequestHandlingError'
  }
)