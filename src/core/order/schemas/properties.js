const commonRegex = require('common/regex')
const ORDER_ENUM = require('../order-enum')


const properties = module.exports


properties._id = {
    description: 'Идентификатор заказа',
    type: 'string',
    pattern: commonRegex.mongoIdPattern,
    errorMessage: {
        pattern: 'Указанный идентификатор заказа невалиден'
    }
}

properties.condition = {
    description: 'Статус заказа',
    type: 'integer',
    enum: ORDER_ENUM.CONDITION.values(),
    errorMessage: {
        type: `Допустимые значения для фильтрации по статусам заказа: ${ORDER_ENUM.CONDITION.values().join(', ')}`,
        enum: `Допустимые значения для фильтрации по статусам заказа: ${ORDER_ENUM.CONDITION.values().join(', ')}`
    }
}

properties.address = {
    description: 'Адрес доставки',
    type: 'string',
    maxLength: 2048,
    errorMessage: {
        type: 'Адрес доставки должен быть строкой',
        maxLength: 'Адрес доставки должен не должен быть больше 2048 символов'
    }
}

properties.phone = {
    description: 'Номер телефона заказчика. Если не указан проверяется наличие телефона в профиле',
    type: 'string',
    pattern: commonRegex.phonePattern,
    errorMessage: {
        type: 'Номер телефона должен быть строкой',
        pattern: 'Указанный номер телефона некорректен'
    }
}

properties.cost = {
    description: 'Стоимость заказа без учёта доставки',
    type: 'integer',
    minimum: 0,
    errorMessage: {
        type: 'Стоимость заказа должно быть целым числом',
        minimum: 'Стоимость заказа не может быть меньше 0'
    }
}

properties.weight = {
    description: 'Суммарный вес заказа в граммах',
    type: 'integer',
    minimum: 0,
    errorMessage: {
        type: 'Вес заказа должен быть целым числом',
        minimum: 'Вес заказа не может быть отрицательным'
    }
}

properties.username = {
    description: 'Имя заказчика указанное при создании заказа',
    type: 'string',
    minLength: 1,
    maxLength: 64,
    errorMessage: {
        type: 'Имя пользователя должно быть строкой',
        minLength: 'Имя пользователя не должно быть короче 1 символа',
        maxLength: 'Имя пользователя не должно превышать 64 символа'
    }
}

properties.client = {
    description: 'Идентификатор клиента',
    type: 'string',
    pattern: commonRegex.mongoIdPattern,
    errorMessage: {
        pattern: 'Указанный идентификатор клиента невалиден'
    }
}

properties.additionalInformation = {
    description: 'Дополнительная информация',
    type: 'string',
    maxLength: 2048,
    errorMessage: {
        type: 'Дополнительная информация должна быть строкой',
        maxLength: 'Дополнительная информация не должен быть больше 2048 символов'
    }
}

properties.time = {
    description: 'Время доставки. Не может быть меньше часа от текущего времени',
    type: 'integer',
    errorMessage: {
        type: 'Временная метка должна быть целым числом'
    }
}

properties.delivery = {
    description: 'Флаг, отвечающий за выбранную доставку. true - выбрана доставка, false - самовывоз.',
    type: 'boolean',
    errorMessage: {
        type: 'Флаг доставки должен быть логическим значением'
    }
}

properties.deliveryCost = {
    description: 'Стоимость доставки заказа',
    type: 'integer',
    minimum: 0,
    errorMessage: {
        type: 'Стоимость заказа должна быть числом',
        minimum: 'Стоимость заказа не может быть отрицательным числом'
    }
}

properties.deliveryCalculateManually = {
    description: 'Флаг отвечающий за ручное определение стоимости доставки',
    type: 'boolean',
    errorMessage: {
        type: 'Флаг отвечающий за ручное определение стоимости доставки должен быть логическим значением'
    }
}

properties.productId = {
    description: 'Идентификатор продукта',
    type: 'string',
    pattern: commonRegex.mongoIdPattern,
    errorMessage: {
        pattern: 'Указанный идентификатор продукта невалиден'
    }
}

properties.productOrderedCount = {
    description: 'Количество заказанных продуктов',
    type: 'integer'
}

properties.productOrderedCost = {
    description: 'Цена продукта на момент заказа',
    type: 'integer'
}

properties.productOrderedWeight = {
    description: 'Вес продукта на момент заказа в граммах',
    type: 'integer'
}

properties.updatedAt = {
    type: 'integer'
}

properties.createdAt = {
    type: 'integer'
}

properties.count = {
    description: 'Количество выбранных продуктов',
    type: 'integer',
    minimum: 1,
    /**
     * TODO: Узнать разумный предел
     */
    maximum: 100000,
    errorMessage: {
        type: 'Количество выбранных продуктов должно быть положительным целым числом',
        minimum: 'Количество выбранных продуктов должно быть положительным целым числом',
        maximum: 'Количество выбранных продуктов не может превышать 100000'
    }
}

properties.discount = {
    description: 'Идентификатор скидки, примененной к заказу',
    type: 'string',
    enum: ORDER_ENUM.ORDER_DISCOUNT.values()
}