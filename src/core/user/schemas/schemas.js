const entities = require('./entities')
const properties = require('./properties')
const {error: commonErrorSchemas} = require('common/schemas')


const schemas = module.exports

schemas.SigninBody = entities.UserCredentials

schemas.SigninResponses = {
    [200]: {
        description: 'Данные пользователя',
        type: 'object',
        properties: {
            user: entities.UserPreview
        },
        additionalProperties: false,
        required: ['user']
    },
    [400]: {
        description: 'Клиентская ошибка',
        type: 'object',
        additionalProperties: true,
        oneOf: [
            ...commonErrorSchemas.oneOfs.JSON
        ]
    }
}

schemas.SignoutResponses = {
    [200]: {
        description: 'Успешное удаление активной сессии',
        type: 'object',
        properties: {
            message: {
                type: 'string',
                default: 'Вы вышли из своего аккаунта',
                example: 'Вы вышли из своего аккаунта'
            }
        }
    },
    [401]: {
        description: 'Ошибка авторизации',
        type: 'object',
        additionalProperties: true,
        oneOf: [
            commonErrorSchemas.UserAuthorizationError
        ]
    }
}

schemas.SignoutAllExceptResponses = {
    [200]: {
        description: 'Успешное удаление сессий пользователя',
        type: 'object',
        properties: {
            message: {
                type: 'string',
                default: 'Удалены все сессии кроме текущей',
                example: 'Удалены все сессии кроме текущей'
            }
        }
    },
    [401]: {
        description: 'Ошибка авторизации',
        type: 'object',
        additionalProperties: true,
        oneOf: [
            commonErrorSchemas.UserAuthorizationError
        ]
    }
}

schemas.SignupUserBody = entities.SignupUser

schemas.SignupUserResponses = {
    [201]: {
        description: 'Зарегистрированного пользователя',
        type: 'object',
        properties: {
            user: entities.UserBase
        },
        additionalProperties: false,
        required: ['user']
    },
    [400]: {
        description: 'Клиентская ошибка',
        type: 'object',
        additionalProperties: true,
        oneOf: [
            ...commonErrorSchemas.oneOfs.JSON
        ]
    }
}

schemas.CreateUserBody = entities.CreateUser

schemas.CreateUserResponses = {
    [201]: {
        description: 'Данные созданного пользователя',
        type: 'object',
        properties: {
            user: entities.UserBase
        },
        additionalProperties: false,
        required: ['user']
    },
    [400]: {
        description: 'Клиентская ошибка',
        type: 'object',
        additionalProperties: true,
        oneOf: [
            ...commonErrorSchemas.oneOfs.JSON
        ]
    },
    [401]: {
        description: 'Ошибка авторизации',
        type: 'object',
        additionalProperties: true,
        oneOf: [commonErrorSchemas.UserAuthorizationError]
    },
    [403]: {
        description: 'Ошибка доступа',
        type: 'object',
        additionalProperties: true,
        oneOf: [commonErrorSchemas.UserRightsError]
    }
}

schemas.GetUserResponses = {
    [200]: {
        description: 'Данные пользователя',
        type: 'object',
        properties: {
            user: entities.UserBase
        },
        additionalProperties: false,
        required: ['user']
    },
    [400]: {
        description: 'Клиентская ошибка',
        type: 'object',
        additionalProperties: true,
        oneOf: [
            ...commonErrorSchemas.oneOfs.JSON
        ]
    },
    [401]: {
        description: 'Ошибка авторизации',
        type: 'object',
        additionalProperties: true,
        oneOf: [commonErrorSchemas.UserAuthorizationError]
    }
}

schemas.UpdateUserBody = entities.UpdateUser

schemas.UpdateUserResponses = {
    [200]: {
        description: 'Обновленные данные пользователя',
        type: 'object',
        properties: {
            user: entities.UserBase
        },
        additionalProperties: false,
        required: ['user']
    },
    [400]: {
        description: 'Клиентская ошибка',
        type: 'object',
        additionalProperties: true,
        oneOf: [...commonErrorSchemas.oneOfs.JSON, ...commonErrorSchemas.oneOfs.File]
    },
    [401]: {
        description: 'Ошибка авторизации',
        type: 'object',
        additionalProperties: true,
        oneOf: [commonErrorSchemas.UserAuthorizationError]
    }
}

schemas.GetUserByIdParams = {
    type: 'object',
    properties: {
        userId: properties._id
    },
    additionalProperties: false,
    required: ['userId']
}

schemas.GetUserByIdResponses = {
    [201]: {
        description: 'Данные пользователя',
        type: 'object',
        properties: {
            user: entities.UserBase
        },
        additionalProperties: false,
        required: ['user']
    },
    [400]: {
        description: 'Клиентская ошибка',
        type: 'object',
        additionalProperties: true,
        oneOf: [
            ...commonErrorSchemas.oneOfs.JSON
        ]
    },
    [401]: {
        description: 'Ошибка авторизации',
        type: 'object',
        additionalProperties: true,
        oneOf: [commonErrorSchemas.UserAuthorizationError]
    },
    [403]: {
        description: 'Ошибка доступа',
        type: 'object',
        additionalProperties: true,
        oneOf: [commonErrorSchemas.UserRightsError]
    }
}

schemas.UpdateUserByIdParams = {
    type: 'object',
    properties: {
        userId: properties._id
    },
    additionalProperties: false,
    required: ['userId']
}

schemas.UpdateUserByIdResponses = {
    [201]: {
        description: 'Обновленные данные пользователя',
        type: 'object',
        properties: {
            user: entities.UserBase
        },
        additionalProperties: false,
        required: ['user']
    },
    [400]: {
        description: 'Клиентская ошибка',
        type: 'object',
        additionalProperties: true,
        oneOf: [...commonErrorSchemas.oneOfs.JSON, ...commonErrorSchemas.oneOfs.File]
    },
    [401]: {
        description: 'Ошибка авторизации',
        type: 'object',
        additionalProperties: true,
        oneOf: [commonErrorSchemas.UserAuthorizationError]
    },
    [403]: {
        description: 'Ошибка доступа',
        type: 'object',
        additionalProperties: true,
        oneOf: [commonErrorSchemas.UserRightsError]
    }
}

schemas.GetUsersListQuery = entities.GetUsersListQuery

schemas.GetUsersListResponses = {
    [200]: {
        descriptions: 'Список пользователей',
        type: 'object',
        properties: {
            total: {
                type: 'integer'
            },
            users: {
                type: 'array',
                items: entities.UserPreview
            }
        },
        additionalProperties: false
    },
    [400]: {
        description: 'Клиентская ошибка',
        type: 'object',
        additionalProperties: true,
        oneOf: [
            commonErrorSchemas.JsonSchemaValidationError
        ]
    },
    [401]: {
        description: 'Ошибка авторизации',
        type: 'object',
        additionalProperties: true,
        oneOf: [commonErrorSchemas.UserAuthorizationError]
    },
    [403]: {
        description: 'Ошибка доступа',
        type: 'object',
        additionalProperties: true,
        oneOf: [commonErrorSchemas.UserRightsError]
    }
}

schemas.DeleteUserByIdParams = {
    type: 'object',
    properties: {
        userId: properties._id
    },
    additionalProperties: false,
    required: ['userId']
}

schemas.DeleteUserByIdResponses = {
    [200]: {
        type: 'object',
        properties: {
            message: {
                type: 'string'
            }
        },
        additionalProperties: false,
        required: ['message']
    },
    [400]: {
        description: 'Клиентская ошибка',
        type: 'object',
        additionalProperties: true,
        oneOf: [
            commonErrorSchemas.JsonSchemaValidationError
        ]
    },
    [401]: {
        description: 'Ошибка авторизации',
        type: 'object',
        additionalProperties: true,
        oneOf: [commonErrorSchemas.UserAuthorizationError]
    },
    [403]: {
        description: 'Ошибка доступа',
        type: 'object',
        additionalProperties: true,
        oneOf: [commonErrorSchemas.UserRightsError]
    }
}