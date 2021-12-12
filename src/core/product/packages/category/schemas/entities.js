const properties = require('./properties')


const entities = module.exports


entities.CategoryBase = {
    title: 'CategoryBase',
    type: 'object',
    properties: {
        _id: properties._id,
        title: properties.title,
        createdAt: properties.createdAt,
        updatedAt: properties.updatedAt
    },
    additionalProperties: false,
    required: ['_id', 'title', 'createdAt', 'updatedAt']
}

entities.CreateCategory = {
    title: 'CreateCategory',
    type: 'object',
    properties: {
        title: properties.title
    },
    additionalProperties: false,
    required: ['title']
}

entities.UpdateCategory = {
    title: 'UpdateCategory',
    type: 'object',
    properties: {
        title: properties.title
    },
    additionalProperties: false,
    required: []
}
