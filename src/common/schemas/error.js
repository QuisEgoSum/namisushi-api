const {ErrorSchemaBuilder} = require('./builders')
const commonRegex = require('../regex/index')


const errorSchemes = module.exports


errorSchemes.JsonSchemaValidationError = new ErrorSchemaBuilder('JsonSchemaValidationError')
    .setMessage('Невалидное свойство JSON')
    .setCode(1)
    .setError('JsonSchemaValidationError')
    .end()

errorSchemes.MultipleErrorJSON = new ErrorSchemaBuilder('MultipleError')
    .setMessage('Невалидное свойство JSON')
    .setCode(1)
    .setError('MultipleError')
    .setAdditionallyOrigin(
        'errors',
        {
            description: 'Массив ошибок',
            oneOf: [errorSchemes.JsonSchemaValidationError]
        }
    )
    .end()

errorSchemes.InvalidJSONStructureError = new ErrorSchemaBuilder('InvalidJSONStructureError')
    .setMessage('Невалидная структура JSON')
    .setCode(2)
    .setError('InvalidJSONStructureError')
    .end()

errorSchemes.UserAuthorizationError = new ErrorSchemaBuilder('UserAuthorizationError')
    .setMessage('Вы не авторизованы')
    .setCode(1000)
    .setError('UserAuthorizationError')
    .setAdditionallyOrigin(
        'sessionId',
        {
            type: 'string',
            pattern: commonRegex.mongoIdPattern
        }
    )
    .end()

errorSchemes.UserRightsError = new ErrorSchemaBuilder('UserRightsError')
    .setMessage('У вас недостаточно прав для выполнения этого действия')
    .setCode(1001)
    .setError('UserRightsError')
    .end()

errorSchemes.FileSizeExceededError = new ErrorSchemaBuilder('FileSizeExceededError')
    .setMessage('Превышен размер файла. Максимальный размер файла {maxFileSize}. Размер предоставленного файла {fileSize}')
    .setCode(21)
    .setError('FileSizeExceededError')
    .setAdditionally('maxFileSize', 'integer', 1)
    .setAdditionally('fileSize', 'integer', 1)
    .setAdditionally('fileIndex', 'integer', 0)
    .setAdditionally('fileKey', 'string', 'images')
    .end()

errorSchemes.FileTypeNotAllowedError = new ErrorSchemaBuilder('FileTypeNotAllowedError')
    .setMessage('Недопустимый тип файла. Файл должен быть одного из следующих типов: {allowedFileTypes.join(\', \')}')
    .setCode(22)
    .setError('FileTypeNotAllowedError')
    .setAdditionallyOrigin(
        'allowedFileTypes',
        {
            type: 'array',
            items: {
                type: 'string'
            },
            example: ['image/jpeg', 'image/png', 'image/jpg']
        }
    )
    .setAdditionally('fileIndex', 'integer', 0)
    .setAdditionally('fileKey', 'string', 'images')
    .setAdditionally('fileMimetype', 'string', 'image/jpg')
    .end()

errorSchemes.NumberOfFilesExceededError = new ErrorSchemaBuilder('NumberOfFilesExceededError')
    .setMessage('Превышено максимальное количество файлов. Ограничение: {maxNumberOfFiles}, отправлено: {numberOfFiles}')
    .setCode(23)
    .setError('NumberOfFilesExceededError')
    .setAdditionally('numberOfFiles', 'integer', 1)
    .setAdditionally('numberOfFiles', 'integer', 2)
    .setAdditionally('fileKey', 'string', 'images')
    .end()


errorSchemes.oneOfs = {
    JSON: [
        errorSchemes.InvalidJSONStructureError,
        errorSchemes.JsonSchemaValidationError,
        errorSchemes.MultipleErrorJSON
    ],
    File: [
        errorSchemes.FileSizeExceededError,
        errorSchemes.FileTypeNotAllowedError,
        errorSchemes.NumberOfFilesExceededError
    ]
}