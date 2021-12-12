const entities = require('./entities')
const properties = require('./properties')
const orderErrorsSchemas = require('./errors')
const {error: commonErrorSchemas, pagination} = require('common/schemas')
const COMMON_ENUM = require("common/enum");
const commonRegex = require("common/regex");


const schemas = module.exports


schemas.CreateOrderBody = entities.CreateOrder

schemas.CreateOrderResponses = {
    [201]: {
        description: 'Объект созданного заказа',
        type: 'object',
        properties: {
            message: {
                type: 'string'
            },
            order: entities.OrderExpand
        },
        additionalProperties: false,
        required: ['message', 'order']

    },
    [400]: {
        description: 'Клиентская ошибка',
        type: 'object',
        additionalProperties: true,
        oneOf: [
            orderErrorsSchemas.OrderProductDoesNotExistError,
            orderErrorsSchemas.PhoneNumberMissingError,
            orderErrorsSchemas.LargeOrderTimeIntervalError,
            ...commonErrorSchemas.oneOfs.JSON
        ]
    }
}

schemas.GetOrderByIdParams = {
    type: 'object',
    properties: {
        orderId: properties._id
    },
    required: ['orderId']
}

schemas.GetOrderByIDResponses = {
    [200]: {
        description: 'Объект заказа (type OrderPopulated)',
        type: 'object',
        properties: {
            order: entities.OrderExpand
        },
        additionalProperties: false,
        required: ['order']
    },
    [400]: {
        description: 'Клиентская ошибка',
        type: 'object',
        additionalProperties: true,
        oneOf: [
            orderErrorsSchemas.OrderNotExistsError,
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

schemas.GetOrdersListAdminQuery = {
    title: 'GetOrdersListAdminQuery',
    type: 'object',
    properties: {
        limit: pagination.limit,
        page: pagination.page,
        condition: properties.condition,
        sortByCost: {
            description: 'Сортировка по стоимости',
            type: 'string',
            enum: COMMON_ENUM.SORT.values(),
            errorMessage: {
                type: `Допустимые значения сортировки по цене заказа: ${COMMON_ENUM.SORT.values().join(', ')}`,
                enum: `Допустимые значения сортировки по цене заказа: ${COMMON_ENUM.SORT.values().join(', ')}`
            }
        },
        sortByDate: {
            description: 'Сортировка по дате создания заказа. Если sortByCost не указан, по умолчанию DESC',
            type: 'string',
            enum: COMMON_ENUM.SORT.values(),
            errorMessage: {
                type: `Допустимые значения сортировки по цене дате создания заказа: ${COMMON_ENUM.SORT.values().join(', ')}`,
                enum: `Допустимые значения сортировки по цене дате создания заказа: ${COMMON_ENUM.SORT.values().join(', ')}`
            }
        },
        delivery: {
            description: 'Фильтр заказов по доставке',
            type: 'boolean',
            errorMessage: {
                type: 'Фильтр по выбранному типу доставки заказа должен иметь логическое значение'
            }
        },
        clientId: {
            description: 'Фильтр заказов по id клиента',
            type: 'string',
            pattern: commonRegex.mongoIdPattern,
            errorMessage: {
                pattern: 'Невалидный уникальный идентификатор клиента'
            }
        }
    },
    additionalProperties: false
}

schemas.GetOrdersListResponses = {
    [200]: {
        description: 'Список заказов',
        type: 'object',
        properties: {
            total: {
                description: 'Количество результатов для указанных критериев',
                type: 'integer',
                minimum: 0
            },
            orders: {
                type: 'array',
                items: entities.OrderBase
            }
        },
        additionalProperties: false,
        required: ['total', 'orders']
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