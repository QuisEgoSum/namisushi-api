

/**
 * @typedef CreateTagBodyJSON
 * @type {Object}
 * @property {String} title
 */


module.exports = {
    type: 'object',
    properties: require('./tag-update.body').properties,
    additionalProperties: false,
    required: ['title']
}