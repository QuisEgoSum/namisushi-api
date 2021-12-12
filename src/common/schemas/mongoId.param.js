module.exports = (...fieldNames) => {
    
    const schema = {
        type: 'object',
        properties: {}
    }

    fieldNames.forEach(fieldName => {
        schema.properties[fieldName] = {
            type: 'string',
            regexp: "/^[0-9a-fA-F]{24}$/",
            errorMessage: {
                regexp: `Невалидный уникальный идентификатор: ${fieldName}`
            }
        }
    })

    return schema
}