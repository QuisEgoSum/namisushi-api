
class ErrorSchemaBuilder {

    /**
     * @param {String} title
     */
    constructor(title) {
        this.schema = {
            title: title,
            type: 'object',
            properties: {},
            additionalProperties: false,
            required: []
        }
    }

    /**
     * @param {String} message
     * @returns {ErrorSchemaBuilder}
     */
    setMessage(message) {
        this.schema.required.push('message')

        this.schema.properties.message = {
            type: 'string',
            default: message,
            example: message
        }

        return this
    }

    /**
     * @param {Number} code
     * @returns {ErrorSchemaBuilder}
     */
    setCode(code) {
        this.schema.required.push('code')

        this.schema.properties.code = {
            type: 'integer',
            default: code,
            example: code
        }

        return this
    }

    /**
     * @param {String} error
     * @returns {ErrorSchemaBuilder}
     */
    setError(error) {
        this.schema.required.push('error')

        this.schema.properties.error = {
            type: 'string',
            default: error,
            example: error
        }

        return this
    }

    /**
     * @param {String} property
     * @param {'string'|'number'|'object'|'array'|'boolean'|'integer'} type
     * @param [value]
     * @param [isRequired]
     * @returns {ErrorSchemaBuilder}
     */
    setAdditionally(property, type, value, isRequired = true) {
        if (isRequired) {
            this.schema.required.push(property)
        }

        this.schema.properties[property] = {
            type: type,
            default: value,
            example: value
        }

        return this
    }

    /**
     * @param {String} property
     * @param {Object} schema
     * @param {Boolean} [isRequired]
     * @returns {ErrorSchemaBuilder}
     */
    setAdditionallyOrigin(property, schema, isRequired= true) {
        if (isRequired) {
            this.schema.required.push(property)
        }

        this.schema.properties[property] = schema

        return this
    }

    end() {
        return this.schema
    }
}


module.exports = {
    ErrorSchemaBuilder
}