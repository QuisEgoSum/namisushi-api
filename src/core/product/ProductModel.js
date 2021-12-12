const {Schema, model} = require('mongoose')


/**
 * @typedef ProductModel
 * @type {Object}
 * @property {String|ObjectId} _id
 * @property {Array.<String>} ingredients
 * @property {Array.<String>} images
 * @property {Array.<String>} tags
 * @property {String} title
 * @property {Number} cost
 * @property {String} description
 * @property {Number} weight
 * 
 * @typedef ExpandProduct
 * @type {Object}
 * @property {Boolean} show
 * @property {import('./packages/category/CategoryModel').Category[]} categories
 * @property {import('./packages/tag/Tag').Tag[]} tags
 * 
 * @typedef {ProductModel & ExpandProduct} ProductExpand
 * 
 * @typedef ProductUnselected
 * @type {Object}
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */


const ProductModel = new Schema(
    {
        show: {
            type: Boolean,
            default: true
        },
        title: {
            type: String,
            unique: true
        },
        description: {
            type: String
        },
        ingredients: {
            type: Array,
            items: {
                type: String
            }
        },
        versions: {
            type: Array,
            items: {
                _id: {
                    type: String
                },
                title: {
                    type: String
                },
                cost: {
                    type: Number
                },
                weight: {
                    type: Number
                }
            }
        },
        cost: {
            type: Number
        },
        weight: {
            //gram
            type: Number
        },
        images: {
            type: Array,
            items: {
                type: String
            }
        },
        tags: {
            type: Array,
            items: {
                type: Schema.Types.ObjectId,
                ref: 'Tag'
            }
        },
        categories: {
            type: Array,
            items: {
                type: Schema.Types.ObjectId,
                ref: 'Category'
            }
        },
        createdAt: {
            type: Number,
            select: false
        },
        updatedAt: {
            type: Number,
            select: false
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

ProductModel.index({categories: 1})
ProductModel.index({tags: 1})
ProductModel.index({show: 1})


module.exports = model('Product', ProductModel, 'products')