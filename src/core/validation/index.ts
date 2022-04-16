import Ajv from 'ajv'
import ajvErrors from 'ajv-errors'
import ajvKeywords from 'ajv-keywords'
import {JsonSchemaValidationErrors, JsonSchemaValidationError} from '@core/error'
import emailValidator from 'email-validator'


export const ajv = new Ajv(
  {
    removeAdditional: true,
    useDefaults: true,
    coerceTypes: true,
    allErrors: true,
    allowUnionTypes: true
  }
)


ajvErrors(ajv, {singleError: false, keepErrors: false})
ajvKeywords(ajv)


ajv.addKeyword({keyword: 'example'})
ajv.addKeyword({keyword: 'content'})
ajv.addKeyword({
    keyword: 'emailValidator',
    validate: (_: any, data: string) => emailValidator.validate(data)
})


export function errorFormatter(error: Record<string, any>) {
    if (error.keyword === 'errorMessage') {
        error.params.errors[0].message = error.message
        error = error.params.errors[0]
    }
    return new JsonSchemaValidationError({
        message: error.message,
        keyword: error.keyword,
        dataPath: error.instancePath || error.dataPath,
        schemaPath: error.schemaPath,
        details: error.params
    })
}

export function schemaErrorFormatter(errors: Record<string, any>[], location: string) {
    return new JsonSchemaValidationErrors({in: location, errors: errors.map(error => errorFormatter(error).toJSON())})
}