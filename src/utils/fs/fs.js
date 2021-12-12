const fs = require('fs')
const path = require('path')
const config = require('@config')
const logger = require('../logger/index')


/**
 * @param {String} pathToFile 
 */
function deleteFileFromRootDir(pathToFile) {
    setImmediate(
        () => fs.unlink(
            path.resolve(config.path.root + pathToFile),
            error => error && logger.error({label: 'delete file from root', ...error, pathToFile})
        )
    )
}

/**
 * @param {String} pathToFile 
 */
function deleteFile(pathToFile) {
    setImmediate(() => fs.unlink(
            pathToFile,
            error => error && logger.error({label: 'delete file', ...error, pathToFile})
        )
    )
}


module.exports = {
    deleteFileFromRootDir,
    deleteFile
}