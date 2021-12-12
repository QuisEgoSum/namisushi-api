const uploadError = require('./upload-error')
const ApplicationError = require('libs/error')
const path = require('path')
const fs = require('fs')
const fsPromises = fs.promises
const uuid = require('uuid')
const logger = require('@logger')


/**
 * @typedef FormDataPostParserOptionsFile
 * @type {Object}
 * @property {String} destination
 * @property {Array<String>} [allowedTypes]
 * @property {Number} [maximumSize]
 * @property {String} key
 * @property {Number} [maxFiles]
 */

/**
 * @typedef FormDataPostParserOptions
 * @type {Object}
 * @property {Array<FormDataPostParserOptionsFile>} [files]
 * @property {String} [jsonBodyKey]
 */

/**
 * @callback FormDataPostParser
 * @async
 * @param {HttpRequest} request
 * @param {HttpReply} reply
 */

/**
 * @typedef FormDataPostFile
 * @type {Object}
 * @property {String} filepath
 * @property {String} filename
 * @property {Number} filesize
 * @property {String} originFilename
 * @property {String} mimetype
 * @property {String} encoding
 */
/**
 * @typedef {Object<String, Array<FormDataPostFile>>} FormDataPostFiles
 */

/**
 * @param {FormDataPostParserOptions} options
 * @returns {FormDataPostParser}
 */
module.exports = function formDataPostParserWrapper(options) {
    return async function formDataPostParser(request) {
        if (!request.headers['content-type']?.startsWith('multipart/form-data')) {
            return
        }

        const body = request.body

        if (options.jsonBodyKey) {
            if (request.body[options.jsonBodyKey]) {
                try {
                    request.body = JSON.parse(request.body[options.jsonBodyKey])
                } catch {
                    throw new ApplicationError.InvalidJSONStructureError()
                }
            } else {
                request.body = {}
            }
        }

        if ('files' in options) {
            const fileUploadQ = []
            const filesUploaded = []

            request.files = {}

            for (const fileOptions of options.files) {

                request.files[fileOptions.key] = []

                if (!body[fileOptions.key]) {
                    continue
                }

                if (body[fileOptions.key].length > fileOptions.maxFiles) {
                    throw new uploadError.NumberOfFilesExceededError(
                        {
                            maxNumberOfFiles: fileOptions.maxFiles,
                            numberOfFiles: body[fileOptions.key].length,
                            fileKey: fileOptions.key
                        }
                    )
                }

                if (fileOptions.key in body) {
                    const files = Array.isArray(body[fileOptions.key])
                        ? body[fileOptions.key]
                        : [body[fileOptions.key]]

                    for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
                        const file = files[fileIndex]

                        if (!file) {
                            continue
                        }


                        if ('allowedTypes' in fileOptions) {
                            if (!fileOptions.allowedTypes.includes(file.mimetype)) {
                                throw new uploadError.FileTypeNotAllowedError(
                                    {
                                        allowedFileTypes: fileOptions.allowedTypes,
                                        fileKey: fileOptions.key,
                                        fileIndex: fileIndex,
                                        fileMimetype: file.mimetype
                                    }
                                )
                            }
                        }

                        if ('maximumSize' in fileOptions) {
                            if (file.data.length > fileOptions.maximumSize) {
                                throw  new uploadError.FileSizeExceededError(
                                    {
                                        maxFileSize: fileOptions.maximumSize,
                                        fileSize: file.data.length,
                                        fileIndex: fileIndex,
                                        fileKey: fileOptions.key
                                    }
                                )
                            }
                        }

                        fileUploadQ
                            .push(
                                {
                                    data: file.data,
                                    path: fileOptions.destination,
                                    ext: path.parse(file.filename).ext,
                                    key: fileOptions.key,
                                    filename: file.filename,
                                    mimetype: file.mimetype,
                                    encoding: file.encoding
                                }
                            )
                    }
                }
            }

            try {
                for (const fileUpload of fileUploadQ) {
                    const filename = uuid.v4() + fileUpload.ext
                    const filepath = path.resolve(fileUpload.path, filename)

                    await fsPromises.writeFile(filepath, fileUpload.data)

                    filesUploaded.push(filepath)

                    request.files[fileUpload.key].push(
                        {
                            filepath: filepath,
                            filename: filename,
                            filesize: fileUpload.data.length,
                            originFilename: fileUpload.filename,
                            mimetype: fileUpload.mimetype,
                            encoding: fileUpload.encoding
                        }
                    )

                    delete fileUpload.data
                }
            } catch (error) {
                filesUploaded.forEach(filepath => fs.rm(filepath, (error) => logger.error(error)))
                throw error
            }
        }
    }
}