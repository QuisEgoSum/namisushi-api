const service = require('./product-service')
const {deleteFile} = require('utils/fs')
const logger = require('@logger')
const ApplicationError = require('libs/error')


/**
 * @param {import('fastify').FastifyRequest & {query: import('./schemas/products.query').ProductsQuery}} req 
 * @param {import('fastify').FastifyReply} res 
 */
module.exports.getProducts = async function(req, res) {
    const response = await service.findProducts(req.query, false)

    res
        .status(200)
        .type('application/json')
        .send(response)
}

/**
 * @param {import('fastify').FastifyRequest & {query: import('./schemas/products.query').ProductsQuery}} req 
 * @param {import('fastify').FastifyReply} res 
 */
module.exports.getProductsExpand = async function(req, res) {
    const response = await service.findProducts(req.query, true)

    res
        .status(200)
        .type('application/json')
        .send(response)
}

/**
 * @param {import('fastify').FastifyRequest & {files: import('./product-upload').ProductPicturesFiles, body: {data: import('./schemas/create-product.body').CreateProductBody}}} req
 * @param {import('fastify').FastifyReply} res 
 */
module.exports.createProduct = async function(req, res) {
    try {
        const product = await service.createProduct(req.body, req.files.images)

        res
            .status(201)
            .type('application/json')
            .send(
                {
                    product: product
                }
            )
    } catch(error) {
        req.files.images
            .forEach(file => deleteFile(file.filepath))
        throw error
    }
}

/**
 * @param {import('fastify').FastifyRequest & {params: {productId: String}, body: {data: import('./schemas/update-product.body').UpdateProductBody}, files: import('./product-upload').ProductPicturesFiles}} req
 * @param {import('fastify').FastifyReply} res 
 */
module.exports.updateProduct = async function(req, res) {
    try {
        const product = await service.updateProduct(req.params.productId, req.body, req.files.images)

        res
            .status(200)
            .type('application/json')
            .send(
                {
                    product: product
                }
            )
    } catch(error) {
        req.files.images
            .forEach(file => deleteFile(file.filepath))
        throw error
    }
}

module.exports.deleteProduct = async function(req, res) {
    await service.deleteProductById(req.params.productId)

    res
        .status(200)
        .type('application/json')
        .send(
            {
                message: 'Продукт удален'
            }
        )
}