const Product = require('./ProductModel')
const {productId} = require("../order/schemas/properties");
const {ObjectId} = require('mongoose').Types


/**
 * @param {import('./schemas/create-product.body').CreateProductBody & {images: String[]}} product 
 * @returns {Promise.<Product & ProductUnselected>}
 */
//@ts-ignore
const saveProduct = product => new Product(product)
    .save()
    .then(product => product.toJSON())

/**
 * @param {String} productId 
 * @param {import('./schemas/update-product.body').UpdateProductBody} update 
 * @returns {Promise.<{_id: ObjectId, images: Array.<String>}>}
 */
const productUpdate = (productId, update) => Product
    .findByIdAndUpdate(ObjectId(productId), update)
    .select({images: 1})
    .lean()

/**
 * @param {ObjectId|String} productId 
 * @returns {Promise.<Product.ProductExpand>}
 */
const findProduct = productId => Product
    .findById(ObjectId(productId))
    .populate([
        // {path: 'tags', model: 'Tag'},
        {path: 'categories', model: 'Category'}
    ])
    .select('+createdAt +updatedAt')
    .lean()

/** 
 * @param {*} options
 * @returns {Promise.<Product.Product[]>}
 */
const findProducts = options => Product
    .find(
        {
            show: true,
            ...options.find
        }
    )
    .sort({createdAt: options.sort.date})
    .skip(options.page)
    .limit(options.limit)
    .select('-categories -show')
    // .populate({path: 'tags', model: 'Tag', select: '-_id'})
    .lean()


/** 
 * @param {*} options
 * @returns {ProductExpand}
 */
const findProductsExpand = options => Product
    .find(options.find)
    .sort({createdAt: options.sort.date})
    .skip(options.page)
    .limit(options.limit)
    .select('+createdAt +updatedAt')
    .populate([
        // {path: 'tags', model: 'Tag'},
        {path: 'categories', model: 'Category'}
    ])
    .lean()

/**
 * @param {*} find
 * @returns {Promise.<Number>}
 */
const countProducts = find => Product
    .countDocuments(find)

/** 
 * @param {ObjectId} tagId
 * @returns {Promise.<{n: Number, ok: Number, deletedCount: Number}>}
 */
const pullTag = tagId => Product
    .updateMany(
        {tags: tagId},
        {$pull: {tags: tagId}}
    )


/**
 * @param {String} categoryId 
 * @returns {Promise.<{n: Number, ok: Number, deletedCount: Number}>}
 */
const pullCategory = categoryId => Product
    .updateMany(
        {categories: ObjectId(categoryId)},
        {$pull: {categories: ObjectId(categoryId)}}
    )

/**
 * @param {Array.<String>} ids 
 * @returns {Promise.<Array.<ProductParameters>>}
 */
const findProductsParameters = ids => Product
    .find(
        {
            _id: {
                $in: ids.map(ObjectId)
            }
        }
    )
    .select(
        {
            _id: 1,
            cost: 1,
            weight: 1
        }
    )
    .lean()

const deleteProductById = productId => Product
    .findByIdAndDelete(ObjectId(productId))
    .select(
        {
            images: 1
        }
    )
    .lean()


module.exports = {
    saveProduct,
    productUpdate,
    findProduct,
    findProducts,
    findProductsExpand,
    countProducts,
    pullTag,
    findProductsParameters,
    pullCategory,
    deleteProductById
}