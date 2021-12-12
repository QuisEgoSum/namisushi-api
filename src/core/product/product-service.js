const productRepository = require('./product-repository')
const {notContain} = require('./tools')
const {deleteFileFromRootDir} = require('../../utils/fs')
const {NotFound} = require('../../utils/error-types')
const {ObjectId} = require('mongoose').Types


/**
 * @param {ProductsQuery} query
 * @param {Boolean} expand
 */
async function findProducts(query, expand) {
    const options = {
        limit: query.limit,
        page: (query.page - 1) * query.limit,
        find: {},
        sort: {
            date: query.sortByDate === 'ASC' ? 1 : -1
        }
    }

    if (!expand) {
        options.find.show = true
    }

    if (query.category) {
        options.find.categories = ObjectId(query.category)
    }

    const [products, total] = await Promise.all(
        [
            expand
                ? productRepository.findProductsExpand(options)
                : productRepository.findProducts(options),
            productRepository.countProducts(options.find)
        ]
    )

    return {
        total: total,
        products: products
    }
}

/**
 * @param {CreateProduct} product
 * @param {FormDataPostFile[]} images
 */
 async function createProduct(product, images = []) {
     const newProduct = {...product}

    if (images.length) {
        newProduct.images = images.map(image => `/image/product/${image.filename}`)
    }

    if (product.tags && product.tags.length) {
        newProduct.tags = product.tags.map(tagId => ObjectId(tagId))
    }

    if (product.categories && product.categories.length) {
        newProduct.categories = product.categories.map(categoryId => ObjectId(categoryId))
    }

    const savedProduct = await productRepository.saveProduct(newProduct)

    return await productRepository.findProduct(savedProduct._id)
}

/**
 * @param {String} productId 
 * @param {UpdateProduct} product
 * @param {FormDataPostFile[]} images
 */
async function updateProduct(productId, product, images = []) {
    /**
     * @type {{$addToSet: {}, $set: {}}}
     */
    const updateProduct = {
        $set: {...product},
        $addToSet: {}
    }

    if (images.length) {
        const imagesUrl = images.map(image => `/image/product/${image.filename}`)

        if ('images' in product) {
            updateProduct.$set.images.push(...imagesUrl)
        } else {
            updateProduct.$addToSet.images = {$each: imagesUrl}
        }
    }

    if ('categories' in product) {
        updateProduct.$set.categories = product.categories.map(categoryId => ObjectId(categoryId))
    }

    const updatedProduct = await productRepository.productUpdate(productId, updateProduct)

    if (!updatedProduct) {
        throw new NotFound('Продукт не найден')
    }

    if (product.images?.length) {
        const removeFiles = notContain(updatedProduct.images, product.images)

        if (removeFiles.length) {
            removeFiles.forEach(link => deleteFileFromRootDir('/image/product/' + link.split('/').pop()))
        }
    }

    return productRepository.findProduct(productId)
}

/**
 * @param {String} tagId 
 * @returns {Promise.<{n: Number}>}
 */
async function pullTag(tagId) {
    return productRepository.pullTag(tagId)
}

async function pullCategory(categoryId) {
    return productRepository.pullCategory(categoryId)
}

/**
 * @param {Array.<String>} productIds 
 */
async function findProductsParameters(productIds) {
    return productRepository.findProductsParameters(productIds)
}

async function deleteProductById(productId) {
    const product = await productRepository.deleteProductById(productId)

    if (!product) {
        throw new NotFound('Продукт не найден')
    }

    product.images.forEach(path => deleteFileFromRootDir('/image/product/' + path.split('/').pop()))
}


module.exports = {
    findProductsParameters,
    findProducts,
    createProduct,
    updateProduct,
    pullTag,
    pullCategory,
    deleteProductById
}
