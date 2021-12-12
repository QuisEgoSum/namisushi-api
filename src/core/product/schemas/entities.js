const properties = require('./properties')
const {schemas: {entities: categoryEntities}} = require('../packages/category')
const {pagination} = require("../../../common/schemas")


const entities = module.exports


entities.ProductBase = {
    title: 'ProductBase',
    type: 'object',
    properties: {
        _id: properties._id,
        title: properties.title,
        description: properties.description,
        ingredients: properties.ingredients,
        cost: properties.cost,
        weight: properties.weight,
        images: properties.images
    },
    additionalProperties: false,
    required: ['_id', 'title', 'cost']
}

entities.ProductPopulated = {
    title: 'ProductPopulated',
    type: 'object',
    properties: {
        _id: properties._id,
        title: properties.title,
        description: properties.description,
        ingredients: properties.ingredients,
        cost: properties.cost,
        weight: properties.weight,
        images: properties.images,
        categories: {
            type: 'array',
            items: categoryEntities.CategoryBase
        },
        updatedAt: properties.updatedAt,
        createdAt: properties.createdAt
    },
    additionalProperties: false,
    // required: ['_id', 'title', 'cost', 'updatedAt', 'createdAt']
}

entities.ProductAdvancedPopulated = {
    title: 'ProductPopulated',
    type: 'object',
    properties: {
        _id: properties._id,
        show: properties.show,
        title: properties.title,
        description: properties.description,
        ingredients: properties.ingredients,
        cost: properties.cost,
        weight: properties.weight,
        images: properties.images,
        categories: {
            type: 'array',
            items: categoryEntities.CategoryBase
        },
        updatedAt: properties.updatedAt,
        createdAt: properties.createdAt
    },
    additionalProperties: false,
    required: ['_id', 'title', 'cost', 'updatedAt', 'createdAt']
}

entities.CreateProduct = {
    title: 'CreateProduct',
    type: 'object',
    properties: {
        show: properties.show,
        title: properties.title,
        description: properties.description,
        cost: properties.cost,
        ingredients: properties.ingredients,
        weight: properties.weight,
        categories: properties.categories
    },
    additionalProperties: false,
    required: ['title', 'cost'],
    errorMessage: {
        type: 'CreateProduct object',
        required: {
            title: 'Укажите название продукта',
            cost: 'Укажите стоимость продукта'
        }
    }
}

entities.UpdateProduct = {
    title: 'UpdateProduct',
    type: 'object',
    properties: {
        show: properties.show,
        title: properties.title,
        description: properties.description,
        cost: properties.cost,
        ingredients: properties.ingredients,
        weight: properties.weight,
        categories: properties.categories,
        images: properties.images
    },
    additionalProperties: false,
}

entities.ProductsQuery = {
    title: 'ProductsQuery',
    type: 'object',
    properties: {
        category: properties.category,
        limit: pagination.limit,
        page: pagination.page,
        sortByDate: pagination.sortByCreatedAt
    }
}