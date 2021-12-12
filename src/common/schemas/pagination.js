module.exports = {
    limit: {
        description: 'Лимит результатов',
        type: 'integer',
        minimum: 1,
        maximum: 100,
        errorMessage: {
            type: 'Лимит результатов должен быть положительным целым числом',
            minimum: 'Лимит результатов должен быть положительным целым числом',
            maximum: 'Лимит результатов не может превышать 100'
        }
    },
    page: {
        description: 'Номе страницы',
        type: 'integer',
        minimum: 1,
        maximum: 1000,
        errorMessage: {
            type: 'Номер страницы должен быть положительным целым числом',
            minimum: 'Номер страницы должен быть положительным целым числом',
            maximum: 'Номер страницы не может превышать 1000'
        }
    },
    sortByCreatedAt: {
        description: 'Сортировка по дате создания',
        type: 'string',
        enum: ['ASC', 'DESC'],
        default: 'DESC',
        errorMessage: {
            enum: 'Поддерживаемы значения сортировки: ASC, DESC'
        }
    },
    totalResult: {
        description: 'Количество результатов для указанных квери',
        type: 'integer'
    }
}