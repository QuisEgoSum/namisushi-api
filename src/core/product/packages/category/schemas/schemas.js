const entities = require('./entities')
const properties = require('./properties')
const {error: commonErrorSchemas} = require('common/schemas')


const schemas = module.exports


schemas.GetCategoriesResponses = {
    [200]: {
        description: 'Список категорий',
        type: 'object',
        properties: {
            categories: {
                type: 'array',
                items: entities.CategoryBase
            }
        },
        additionalProperties: false,
        required: ['categories']
    }
}

schemas.CreateCategoryBody = entities.CreateCategory

schemas.CreateCategoryResponses = {
    [201]: {
        description: 'Объект созданной категории',
        type: 'object',
        properties: {
            category: entities.CategoryBase
        },
        additionalProperties: false,
        required: ['category']
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

schemas.UpdateCategoryBody = entities.CreateCategory

schemas.UpdateCategoryParams = {
    type: 'object',
    properties: {
        categoryId: properties._id
    },
    additionalProperties: false,
    required: ['categoryId']
}

schemas.UpdateCategoryResponses = {
    [201]: {
        description: 'Объект обновленной категории',
        type: 'object',
        properties: {
            category: entities.CategoryBase
        },
        additionalProperties: false,
        required: ['category']
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

schemas.DeleteCategoryParams = {
    type: 'object',
    properties: {
        categoryId: properties._id
    },
    additionalProperties: false,
    required: ['categoryId']
}

schemas.DeleteCategoryResponses = {
    [201]: {
        description: 'Объект обновленной категории',
        type: 'object',
        properties: {
            message: {
                type: 'string',
                default: 'Категория удалена',
                example: 'Категория удалена'
            }
        },
        additionalProperties: false,
        required: ['message']
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