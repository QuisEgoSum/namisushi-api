const controller = require('./product-http-controller')
const security = require('../../helpers/security')
const {schemas} = require('./schemas')
const upload = require('helpers/upload')
const ProductCategory = require('./packages/category')
const ProductTag = require('./packages/tag')
const config = require("@config");


module.exports = async function(fastify) {
    fastify
        .route(
            {
                method: 'GET',
                path: '/api/products',
                schema: {
                    summary: 'Получить продукты',
                    tags: ['Product'],
                    query: schemas.GetProductsQuery,
                    response: schemas.GetProductsResponses
                },
                handler: controller.getProducts
            }
        )
        .route(
            {
                method: 'GET',
                path: '/api/admin/products',
                schema: {
                    summary: 'Получить расширенные продукты',
                    tags: ['Product'],
                    query: schemas.GetExpandProductsQuery,
                    response: schemas.GetExpandProductsResponses
                },
                onRequest: [security.authorization, security.isAdmin],
                handler: controller.getProductsExpand
            }
        )
        .route(
            {
                method: 'POST',
                path: '/api/admin/product',
                schema: {
                    summary: 'Создать продукт',
                    description: 'Для form-data данные должны быть в свойстве data сериализованные в JSON. Изображения в свойстве images.',
                    tags: ['Product'],
                    consumes: ['application/json', 'multipart/form-data'],
                    body: schemas.CreateProductBody,
                    response: schemas.CreateProductReponses
                },
                onRequest: [security.authorization, security.isAdmin],
                preValidation: upload.formData(
                    {
                        jsonBodyKey: 'data',
                        files: [
                            {
                                key: 'images',
                                destination: config.path.productImage,
                                allowedTypes: config.product.image.file.allowedTypes,
                                maximumSize: config.product.image.file.maximumSize,
                                maxFiles: 20
                            }
                        ]
                    }
                ),
                handler: controller.createProduct,
            }
        )
        .route(
            {
                method: 'PATCH',
                path: '/api/admin/product/:productId',
                schema: {
                    summary: 'Обновить продукт',
                    tags: ['Product'],
                    params: schemas.UpdateProductParams,
                    body: schemas.UpdateProductBody,
                    response: schemas.UpdateProductResponse
                },
                onRequest: [security.authorization, security.isAdmin],
                preValidation: upload.formData(
                    {
                        jsonBodyKey: 'data',
                        files: [
                            {
                                key: 'images',
                                destination: config.path.productImage,
                                allowedTypes: config.product.image.file.allowedTypes,
                                maximumSize: config.product.image.file.maximumSize,
                                maxFiles: 20
                            }
                        ]
                    }
                ),
                handler: controller.updateProduct
            }
        )
        .route(
            {
                method: 'DELETE',
                path: '/api/admin/product/:productId',
                schema: {
                    summary: 'Удалить продукт',
                    tags: ['Product'],
                    params: schemas.UpdateProductParams,
                    response: {
                        [200]: {
                            type: 'object',
                            properties: {
                                message: {
                                    type: 'string'
                                }
                            }
                        }
                    }
                },
                onRequest: [security.authorization, security.isAdmin],
                handler: controller.deleteProduct
            }
        )


    await ProductCategory.httpRouter(fastify)
    await ProductTag.httpRouter(fastify)

}