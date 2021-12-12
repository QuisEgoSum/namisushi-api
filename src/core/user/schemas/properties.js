const regexps = require('common/regex')
const USER_ENUM = require('../user-enum')


const properties = module.exports


properties._id = {
    description: 'Идентификатор пользователя',
    type: 'string',
    pattern: regexps.mongoIdPattern,
    errorMessage: {
        type: 'Идентификатор пользователя должен быть строкой',
        pattern: 'Невалидный идентификатор пользователя'
    }
}

properties.name = {
    type: 'string',
    maxLength: 64,
    minLength: 1,
    errorMessage: {
        type: 'Имя пользователя должно быть строкой',
        minLength: 'Имя должно содержать хотя бы 1 символ',
        maxLength: 'Имя не может превышать 64 символа'
    }
}

properties.phone = {
    description: 'Номер телефона пользователя',
    type: 'string',
    pattern: regexps.phonePattern,
    errorMessage: {
        type: 'Номер телефона должен быть строкой',
        pattern: 'Указанный номер телефона не валиден'
    }
}

properties.address = {
    description: 'Адрес доставки пользователя',
    type: 'string',
    minLength: 1,
    maxLength: 256,
    errorMessage: {
        type: 'Адрес должен быть строкой',
        minLength: 'Адрес не должен быть короче 1 символа',
        maxLength: 'Адрес не должен превышать 256 символов'
    }
}

properties.addressAlias = {
    description: 'Псевдоним адреса доставки пользователя',
    type: 'string',
    minLength: 1,
    maxLength: 64,
    errorMessage: {
        type: 'Псевдоним адреса должен быть строкой',
        minLength: 'Псевдоним адреса должен содержать хотя бы 1 символ',
        maxLength: 'Псевдоним адреса должен содержать не более 64 символов'
    }
}

properties.avatar = {
    description: 'Аватарка пользователя. Относительная ссылка на файл или строка для случайной генерации по шаблону #random={uuid()}',
    type: 'string',
    errorMessage: {
        type: 'Поле аватарка пользователя должно быть строкой'
    }
}

properties.role = {
    description: 'Роль пользователя',
    type: 'string',
    enum: USER_ENUM.USER_ROLE.values(),
    errorMessage: {
        type: `Допустимые значения роли пользователя: ${USER_ENUM.USER_ROLE.values().join(', ')}`,
        enum: `Допустимые значения роли пользователя: ${USER_ENUM.USER_ROLE.values().join(', ')}`
    }
}

properties.email = {
    description: 'Адрес электронной почты пользователя',
    type: 'string',
    emailValidator: true,
    transform: ['trim', 'toLowerCase'],
    errorMessage: {
        type: 'Электронный адрес должен быть строкой',
        minLength: 'Адрес электронной почты не может быть короче 3 символов',
        maxLength: 'Адрес электронной почты не может быть длиннее 64 символов'
    }
}

properties.password = {
    description: 'Пароль пользователя',
    type: 'string',
    maxLength: 64,
    minLength: 6,
    errorMessage: {
    type: 'Invalid data type in the password field',
        minLength: 'Пароль должен быть длиннее 6 символов',
        maxLength: 'Пароль не может превышать 64 символа'
    }
}

properties.updatedAt = {
    description: 'Временная метка обновления пользователя',
    type: 'integer'
}

properties.createdAt = {
    description: 'Временная метка создания пользователя',
    type: 'integer'
}

properties.sortByCreatedAt = {
    type: 'string',
    enum: ['ASC', 'DESC'],
    default: 'DESC',
    errorMessage: {
        type: 'Допустимые значения сортировки по дате создания: ASC, DESC',
        enum: 'Допустимые значения сортировки по дате создания: ASC, DESC'
    }
}