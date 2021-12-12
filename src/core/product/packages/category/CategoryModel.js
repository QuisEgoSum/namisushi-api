const {Schema, model} = require('mongoose')


/**
 * @typedef CategoryModel
 * @type {Object}
 * @property {ObjectId|String} _id
 * @property {String} title
 */


const CategoryModel = new Schema(
    {
        title: {
            type: String
        },
        createdAt: {
            type: Number
        },
        updatedAt: {
            type: Number
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)


CategoryModel.index({title: 1}, {unique: true})


module.exports = model('Category', CategoryModel, 'product_categories')