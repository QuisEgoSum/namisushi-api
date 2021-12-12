const Ajv = require('ajv').default
const ajv = new Ajv({
    removeAdditional: true,
    useDefaults: true,
    coerceTypes: true,
    allErrors: true,
    $data: true
})
require('ajv-errors')(ajv, {singleError: false, keepErrors: false})
require('ajv-keywords')(ajv)
const emailValidator = require('email-validator')
const ApplicationError = require('libs/error')


ajv.addKeyword({
    keyword: 'emailValidator',
    validate: (_, data) => emailValidator.validate(data)
})

/**
 * @param {String} string 
 * @throws {BadRequest}
 */
function JSONParse(string) {
    try {
        return JSON.parse(string)
    } catch {
        throw new ApplicationError.InvalidJSONStructureError()
    }
}


module.exports = function(schema) {
    const validate = ajv.compile(schema)

    /**
     * @param {Object} data
     */ 
    return function(data) {
        validate(data)

        if (validate.errors) {
            if (validate.errors.length > 1) {
                throw new ApplicationError.MultipleError(
                    validate.errors.map(
                        error => new ApplicationError.JsonSchemaValidationError(
                            {
                                message: error.message,
                                code: 1
                            }
                        )
                    )
                )
            } else {
                throw new ApplicationError.JsonSchemaValidationError(
                        {
                            message: validate.errors[0].message,
                            code: 1
                        }
                    )
                }
        }
    }
}

/**
 * @param {*} body 
 * @throws {BadRequest}
 */
module.exports.normalizeBody = function(body) {
    if (!body)
        body = {}

    if (!body.data)
        body.data = {}
    
    if (typeof body.data === 'string')
        body.data = JSONParse(body.data)
    else
        body = {data: body}

    return body
}

module.exports.ajv = ajv

/**
 * @param {FastifySchemaValidationError[]} errors
 * @return {Error|ApplicationError.JsonSchemaValidationError|ApplicationError.MultipleError}
 */
module.exports.schemaErrorFormatter = (errors) => {
    if (errors.length > 1) {
        return new ApplicationError.MultipleError(
            errors.map(
                error => new ApplicationError.JsonSchemaValidationError(
                    {
                        message: error.message,
                        code: 1
                    }
                )
            )
        )
    } else {
        return new ApplicationError.JsonSchemaValidationError(
            {
                message: errors[0].message,
                code: 1
            }
        )
    }
}