const properties = require('./properties')
const {schemas: productSchemas} = require("core/product");


const entities = module.exports


entities.OrderProductsOrderedPopulated = {
    title: 'OrderProductsOrderedPopulated',
    type: 'array',
    items: {
        type: 'object',
        properties: {
            count: properties.count,
            cost: properties.productOrderedCost,
            weight: properties.productOrderedWeight,
            product: productSchemas.entities.ProductBase
        },
        additionalProperties: false,
        required: ['product', 'count', 'cost', 'weight']
    },
    uniqueItemProperties: ['product'],
    errorMessage: {
        uniqueItemProperties: 'Один и тот же идентификатор продукта указан дважды'
    }
}

entities.OrderProductsWishList = {
    title: 'OrderProductsWishList',
    type: 'array',
    items: {
        type: 'object',
        properties: {
            product: properties.productId,
            count: properties.count
        },
        additionalProperties: false,
        required: ['product', 'count']
    },
    minItems: 1,
    errorMessage: {
        minItems: 'Выберите хотя бы один продукт'
    }
}

entities.CreateOrder = {
    title: 'CreateOrder',
    type: 'object',
    properties: {
        products: entities.OrderProductsWishList,
        address: properties.address,
        phone: properties.phone,
        username: properties.username,
        additionalInformation: properties.additionalInformation,
        time: properties.time,
        delivery: properties.delivery,
        deliveryCost: properties.deliveryCost,
        deliveryCalculateManually: properties.deliveryCalculateManually
    },
    additionalProperties: false,
    required: ['products', 'delivery']
}

entities.OrderBase = {
    title: 'OrderBase',
    type: 'object',
    properties: {
        _id: properties._id,
        condition: properties.condition,
        address: properties.address,
        phone: properties.phone,
        cost: properties.cost,
        weight: properties.weight,
        username: properties.username,
        client: properties.client,
        additionalInformation: properties.additionalInformation,
        time: properties.time,
        delivery: properties.delivery,
        deliveryCost: properties.deliveryCost,
        deliveryCalculateManually: properties.deliveryCalculateManually,
        discount: properties.discount,
        updatedAt: properties.updatedAt,
        createdAt: properties.createdAt
    },
    additionalProperties: false,
}

entities.OrderExpand = {
    title: 'OrderPopulated',
    properties: {
        _id: properties._id,
        condition: properties.condition,
        address: properties.address,
        phone: properties.phone,
        cost: properties.cost,
        weight: properties.weight,
        username: properties.username,
        client: properties.client,
        additionalInformation: properties.additionalInformation,
        time: properties.time,
        delivery: properties.delivery,
        deliveryCost: properties.deliveryCost,
        deliveryCalculateManually: properties.deliveryCalculateManually,
        discount: properties.discount,
        products: entities.OrderProductsOrderedPopulated,
        updatedAt: properties.updatedAt,
        createdAt: properties.createdAt
    },
    additionalProperties: false
}