

/**
 * @typedef Tag
 * @type {Object}
 * @property {import('mongoose').ObjectId} _id
 * @property {String} icon
 * @property {String} title
 */


module.exports = {
    type: 'object',
    properties: {
        _id: {
            type: 'string'
        },
        icon: {
            type: 'string'
        },
        title: {
            type: 'string'
        }
    }
}