

/**
 * @typedef UpdateTagBodyJSON
 * @type {Object}
 * @property {String} [title]
 */


module.exports = {
    type: 'object',
    properties: {
        title: {
            type: 'string'
        }
    },
    additionalProperties: false
}