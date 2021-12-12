const {schemas: categorySchemas} = require('core/product/packages/category')
const regexps = require("common/regex");


const properties = module.exports


properties._id = {
    description: 'Идентификатор продукта',
    type: 'string',
    pattern: regexps.mongoIdPattern,
    errorMessage: {
        type: 'Идентификатор продукта должен быть строкой',
        pattern: 'Невалидный идентификатор продукта'
    }
}

properties.show = {
    description: 'Флаг, отвечающий за то, является ли продукт скрытым для пользователя',
    type: 'boolean'
}

properties.title = {
    description: 'Название продукта',
    type: 'string',
    minLength: 3,
    maxLength: 64,
    errorMessage: {
        type: 'Название продукта должно быть строкой',
        minLength: 'Название продукта не должно быть короче 3 символов',
        maxLength: 'Название продукта не должно быть длиннее 64 символов'
    }
}

properties.description = {
    description: 'Описание продукта',
    type: 'string',
    minLength: 3,
    maxLength: 1024,
    errorMessage: {
        type: 'Описание продукта должно быть строкой',
        minLength: 'Описание продукта не должно содержать менее 3х символов',
        maxLength: 'Описание продукта не должно содержать более 1024 символов'
    }
}

properties.ingredients = {
    description: 'Список ингредиентов продукта',
    type: 'array',
    items: {
        type: 'string',
        minLength: 1,
        maxLength: 64,
        errorMessage: {
            type: 'Ингредиент продукта должен быть строкой',
            minLength: 'Именование ингредиента продукта не должно быть короче 1 символа',
            maxLength: 'Именование ингредиента продукта не должно быть длиннее 64 символа'
        }
    },
    maxItems: 100,
    errorMessage: {
        type: 'Ингредиенты продукта должны быть списком строк',
        maxItems: 'Количество ингредиентов продукта не должно превышать 100'
    }
}

properties.cost = {
    description: 'Цена продукта',
    type: 'integer',
    minimum: 0,
    maximum: 1000000,
    errorMessage: {
        type: 'Цена продукта должна быть целым числом',
        minimum: 'Цена продукта не должна быть отрицательной',
        maximum: 'Цена продукта не должна превышать 1000000'
    }
}

properties.weight = {
    description: 'Вес продукта',
    type: 'integer',
    minimum: 0,
    maximum: 1000000,
    errorMessage: {
        type: 'Вес продукта должен быть целым числом',
        minimum: 'Вес продукта не может быть меньше 0',
        maximum: 'Вес продукта не может превышать 1000000'
    }
}

properties.images = {
    description: 'Список изображений продукта',
    type: 'array',
    items: {
        type: 'string'
    }
}

properties.tags = {
    description: 'Список идентификаторов тегов продукта',
    type: 'array',
    items: {
        type: 'string'
    }
}

properties.category = {
    type: 'string',
    pattern: regexps.mongoIdPattern,
    errorMessage: {
        type: 'Идентификатор категории должен быть строкой',
        pattern: 'Идентификатор категории невалиден'
    }
}

properties.categories = {
    description: 'Список идентификаторов категорий продукта',
    type: 'array',
    items: properties.category,
    maxItems: 20,
    errorMessage: {
        maxItems: 'Количество категорий не может превышать 20'
    }
}

properties.categoriesPopulated = {
    description: 'Список объектов категорий продукта',
    type: 'array',
    items: categorySchemas.entities.CategoryBase
}

properties.updatedAt = {
    description: 'Временная метка последнего обновления продукта',
    type: 'integer'
}

properties.createdAt = {
    description: 'Временная метка создания продукта',
    type: 'integer'
}