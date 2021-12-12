const properties = require('./properties')
const {pagination} = require("../../../common/schemas");


const entities = module.exports


entities.UserAddresses = {
    title: 'UserAddresses',
    type: 'array',
    items: {
        type: 'object',
        properties: {
            address: properties.address,
            alias: properties.addressAlias
        },
        additionalProperties: false,
        required: ['address']
    },
    maxItems: 30,
    errorMessage: {
        maxItems: 'Количество адресов не должно превышать 30'
    }
}

entities.UserCredentials = {
    title: 'UserCredentials',
    type: 'object',
    properties: {
        email: properties.email,
        password: properties.password
    },
    additionalProperties: false,
    required: ['email', 'password'],
    errorMessage: {
        required: {
            email: 'Укажите адрес электронной почты',
            password: 'Укажите пароль'
        }
    }
}

entities.SignupUser = {
    title: 'SignupUser',
    type: 'object',
    properties: {
        email: properties.email,
        password: properties.password,
        name: properties.name,
        phone: properties.phone,
        addresses: entities.UserAddresses
    },
    additionalProperties: false,
    required: ['email', 'password', 'name'],
    errorMessage: {
        required: {
            email: 'Укажите адрес электронной почты',
            password: 'Укажите пароль',
            name: 'Укажите имя'
        }
    }
}

entities.CreateUser = {
    title: 'CreateUser',
    type: 'object',
    properties: {
        email: properties.email,
        password: properties.password,
        name: properties.name,
        phone: properties.phone,
        role: properties.role,
        addresses: entities.UserAddresses
    },
    additionalProperties: false,
    required: []
}

entities.UpdateUser = {
    title: 'UpdateUser',
    type: 'object',
    properties: {
        name: properties.name,
        phone: properties.phone,
        addresses: entities.UserAddresses
    },
    additionalProperties: false,
    required: []
}

entities.UpdateUserExpand = {
    title: 'UpdateUserExpand',
    type: 'object',
    properties: {
        name: properties.name,
        phone: properties.phone,
        addresses: entities.UserAddresses,
        role: properties.role
    },
    additionalProperties: false,
    required: []
}

entities.UserPreview = {
    title: 'UserPreview',
    type: 'object',
    properties: {
        _id: properties._id,
        email: properties.email,
        role: properties.role,
        phone: properties.phone,
        avatar: properties.avatar,
        updatedAt: properties.updatedAt,
        createdAt: properties.createdAt
    },
    additionalProperties: false,
    required: ['_id', 'email', 'role', 'updatedAt', 'createdAt']
}

entities.UserBase = {
    title: 'UserBase',
    type: 'object',
    properties: {
        _id: properties._id,
        email: properties.email,
        role: properties.role,
        phone: properties.phone,
        avatar: properties.avatar,
        addresses: entities.UserAddresses,
        updatedAt: properties.updatedAt,
        createdAt: properties.createdAt
    },
    additionalProperties: false,
    required: ['_id', 'email', 'role', 'updatedAt', 'createdAt']
}

entities.GetUsersListQuery = {
    title: 'GetUsersListQuery',
    type: 'object',
    properties: {
        page: pagination.page,
        limit: pagination.limit,
        sort: properties.sortByCreatedAt,
        name: properties.name,
        email: {
            type: 'string'
        },
        phone: {
            type: 'string'
        },
        role: properties.role,
        strict: {
            type: 'boolean',
            default: false
        }
    },
    additionalProperties: false,
    required: []
}