const {Schema, model} = require('mongoose')


/**
 * @typedef Tag
 * @type {Object}
 * @property {Schema.Types.ObjectId} _id
 * @property {String} title
 * @property {String} icon
 */


const Tag = new Schema(
    {
        title: {
            type: String,
            unique: true
        },
        icon: {
            type: String
        }
    },
    {
        versionKey: false,
        timestamps: false
    }
)


module.exports = model('Tag', Tag, 'product_tags')