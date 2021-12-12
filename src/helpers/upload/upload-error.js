const ApplicationError = require('libs/error')


class FileSizeExceededError extends ApplicationError.InvalidDataError {
    /**
     * @param {Object} error
     * @param {String} [error.message]
     * @param {Number} [error.code]
     * @param {Number} error.maxFileSize
     * @param {Number} error.fileSize
     * @param {Number} error.fileIndex
     * @param {String} error.fileKey
     */
    constructor(
        {
            message,
            code,
            maxFileSize,
            fileSize,
            fileIndex,
            fileKey
        }
    ) {
        super(
            {
                message: message || `Превышен размер файла. Максимальный размер файла ${maxFileSize}. Размер предоставленного файла ${fileSize}`,
                code: code || 21
            }
        )

        this.maxFileSize = maxFileSize
        this.fileSize = fileSize
        this.fileIndex = fileIndex ?? -1
        this.fileKey = fileKey
    }

    toJSON() {
        const error = super.toJSON()

        error.maxFileSize = this.maxFileSize
        error.fileSize = this.fileSize
        error.fileIndex = this.fileIndex
        error.fileKey = this.fileKey

        return error
    }
}

class FileTypeNotAllowedError extends ApplicationError.InvalidDataError {
    /**
     * @param {Object} error
     * @param {String} [error.message]
     * @param {Number} [error.code]
     * @param {Array<String>} error.allowedFileTypes
     * @param {Number} error.fileIndex
     * @param {String} error.fileKey
     * @param {String} error.fileMimetype
     */
    constructor(
        {
            message,
            code,
            allowedFileTypes,
            fileIndex,
            fileKey,
            fileMimetype
        }
    ) {
        super(
            {
                message: message || `Недопустимый тип файла. Файл должен быть одного из следующих типов: ${allowedFileTypes.join(', ')}`,
                code: code || 22
            }
        )

        this.allowedFileTypes = allowedFileTypes
        this.fileIndex = fileIndex ?? -1
        this.fileKey = fileKey
        this.fileMimetype = fileMimetype
    }

    toJSON() {
        const error = super.toJSON()

        error.allowedFileTypes = this.allowedFileTypes
        error.fileIndex = this.fileIndex
        error.fileKey = this.fileKey
        error.fileMimetype = this.fileMimetype

        return error
    }
}

class NumberOfFilesExceededError extends ApplicationError.InvalidDataError {
    constructor(
        {
            message,
            code,
            maxNumberOfFiles,
            numberOfFiles,
            fileKey
        }
    ) {
        super(
            {
                message: message || `Превышено максимальное количество файлов. Ограничение: ${maxNumberOfFiles}, отправлено: ${numberOfFiles}`,
                code: code || 23
            }
        )

        this.maxNumberOfFiles = maxNumberOfFiles
        this.numberOfFiles = numberOfFiles
        this.fileKey = fileKey
    }

    toJSON() {
        const error = super.toJSON()

        error.maxNumberOfFiles = this.maxNumberOfFiles
        error.numberOfFiles = this.numberOfFiles
        error.fileKey = this.fileKey

        return error
    }
}


module.exports = {
    FileSizeExceededError,
    FileTypeNotAllowedError,
    NumberOfFilesExceededError
}