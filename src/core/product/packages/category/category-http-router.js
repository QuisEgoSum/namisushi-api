const {getCategories, createCategory, updateCategory, deleteCategory} = require('./category-http-controller')
const security = require('../../../../helpers/security')
const {schemas} = require('./schemas')


module.exports = async function(fastify) {
    fastify
        .route(
            {
                method: 'GET',
                path: '/api/categories',
                schema: {
                    summary: 'Получить список категорий',
                    tags: ['Category'],
                    response: schemas.GetCategoriesResponses
                },
                handler: getCategories
            }
        )
        .route(
            {
                method: 'GET',
                path: '/api/admin/product/categories',
                schema: {
                    summary: 'Получить список категорий для администратора(Лишнее?)',
                    tags: ['Category'],
                    response: {
                        response: schemas.GetCategoriesResponses
                    }
                },
                onRequest: [security.authorization, security.isAdmin],
                handler: getCategories
            }
        )
        .route(
            {
                method: 'POST',
                path: '/api/admin/product/category',
                schema: {
                    summary: 'Создать категорию',
                    tags: ['Category'],
                    body: schemas.CreateCategoryBody,
                    response: schemas.CreateCategoryResponses
                },
                onRequest: [security.authorization, security.isAdmin],
                handler: createCategory
            }
        )
        .route(
            {
                method: 'PATCH',
                path: '/api/admin/product/category/:categoryId',
                schema: {
                    summary: 'Обновить категорию',
                    tags: ['Category'],
                    params: schemas.UpdateCategoryParams,
                    body: schemas.UpdateCategoryBody,
                    response: schemas.UpdateCategoryResponses
                },
                onRequest: [security.authorization, security.isAdmin],
                handler: updateCategory
            }
        )
        .route(
            {
                method: 'DELETE',
                path: '/api/admin/product/category/:categoryId',
                schema: {
                    summary: 'Удалить категорию',
                    tags: ['Category'],
                    params: schemas.DeleteCategoryParams,
                    response: schemas.DeleteCategoryResponses
                },
                onRequest: [security.authorization, security.isAdmin],
                handler: deleteCategory
            }
        )
}