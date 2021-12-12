const entities = require('./entities')
const properties = require('./properties')
const {pagination} = require('../../../common/schemas')
const {error: commonErrorSchemas} = require('common/schemas')


const schemas = module.exports


schemas.GetProductsQuery = entities.ProductsQuery

schemas.GetProductsResponses = {
    [200]: {
        description: 'Список продуктов',
        type: 'object',
        properties: {
            total: pagination.totalResult,
            products: {
                type: 'array',
                items: entities.ProductPopulated
            }
        },
        additionalProperties: false,
        required: ['total', 'products']
    },
    [400]: {
        description: 'Клиентская ошибка',
        type: 'object',
        additionalProperties: true,
        oneOf: [...commonErrorSchemas.oneOfs.JSON]
    }
}

schemas.GetExpandProductsQuery = entities.ProductsQuery

schemas.GetExpandProductsResponses = {
    [200]: {
        description: 'Список продуктов',
        type: 'object',
        properties: {
            total: pagination.totalResult,
            products: {
                type: 'array',
                items: entities.ProductAdvancedPopulated
            }
        },
        additionalProperties: false,
        required: ['total', 'products']
    },
    [400]: {
        description: 'Клиентская ошибка',
        type: 'object',
        additionalProperties: true,
        oneOf: [...commonErrorSchemas.oneOfs.JSON]
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

schemas.CreateProductBody = entities.CreateProduct

schemas.CreateProductReponses = {
    [201]: {
        description: 'Созданный продукт',
        type: 'object',
        properties: {
            product: entities.ProductPopulated
        },
        additionalProperties: false,
        required: ['product']
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

schemas.UpdateProductBody = entities.UpdateProduct

schemas.UpdateProductParams = {
    type: 'object',
    properties: {
        productId: properties._id
    },
    required: ['productId'],
    additionalProperties: false
}

schemas.UpdateProductResponse = {
    [201]: {
        description: 'Обновленный продукт',
        type: 'object',
        properties: {
            product: entities.ProductPopulated
        },
        required: ['product'],
        additionalProperties: false
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