const regexps = require('common/regex')


const properties = module.exports


properties._id = {
    description: 'Идентификатор категории',
    type: 'string',
    pattern: regexps.mongoIdPattern,
    errorMessage: {
        type: 'Идентификатор категории должен быть строкой'
    }
}

properties.title = {
    description: 'Название категории',
    type: 'string',
    maxLength: 64,
    minLength: 1,
    errorMessage: {
        type: 'Название категории должно быть строкой',
        maxLength: 'Название категории не может быть длиннее 64 символов',
        minLength: 'Название категории не может быть короче 1 символа'
    }
}

properties.createdAt = {
    description: 'Временная метка создания категории',
    type: 'integer'
}

properties.updatedAt = {
    description: 'Временная метка обновления категории',
    type: 'integer'
}
