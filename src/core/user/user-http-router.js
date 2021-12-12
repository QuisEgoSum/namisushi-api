const controller = require('./user-http-controller')
const upload = require('helpers/upload')
const security = require('../../helpers/security')
const {schemas} = require('./schemas')
const config = require("@config");


module.exports = async function(fastify) {
    fastify
        .route(
            {
                method: 'POST',
                path: '/api/signin',
                schema: {
                    summary: 'Пользовательская авторизация',
                    tags: ['User'],
                    body: schemas.SigninBody,
                    response: schemas.SigninResponses
                },
                handler: controller.signin
            }
        )
        .route(
            {
                method: 'PUT',
                path: '/api/signout',
                schema: {
                    summary: 'Удаление активной сессии',
                    tags: ['User'],
                    response: schemas.SignoutResponses
                },
                onRequest: security.authorization,
                handler: controller.signout
            }
        )
        .route(
            {
                method: 'PUT',
                path: '/api/signout/all',
                schema: {
                    summary: 'Удаление всех активных сессий кроме текущей',
                    tags: ['User'],
                    response: schemas.SignoutAllExceptResponses
                },
                onRequest: security.authorization,
                handler: controller.signoutAllExcept
            }
        )
        .route(
            {
                method: 'POST',
                path: '/api/signup',
                schema: {
                    summary: 'Регистрация нового аккаунта',
                    tags: ['User'],
                    body: schemas.SignupUserBody,
                    response: schemas.SignupUserResponses
                },
                handler: controller.signup
            }
        )
        .route(
            {
                method: 'POST',
                path: '/api/admin/user',
                schema: {
                    summary: 'Создания пользователя',
                    tags: ['User'],
                    body: schemas.CreateUserBody,
                    response: schemas.CreateUserResponses
                },
                onRequest: [security.authorization, security.isAdmin],
                handler: controller.createUser
            }
        )
        .route(
            {
                method: 'GET',
                path: '/api/user',
                schema: {
                    summary: 'Получить информацию об авторизованном пользователе',
                    tags: ['User'],
                    response: schemas.GetUserResponses
                },
                onRequest: security.authorization,
                handler: controller.getUser
            }
        )
        .route(
            {
                method: 'PATCH',
                path: '/api/user',
                schema: {
                    summary: 'Обновить авторизованного пользователя',
                    tags: ['User'],
                    body: schemas.UpdateUserBody,
                    response: schemas.UpdateUserResponses
                },
                onRequest: security.authorization,
                preValidation: upload.formData(
                    {
                        jsonBodyKey: 'data',
                        files: [
                            {
                                key: 'avatar',
                                destination: config.path.userAvatar,
                                allowedTypes: config.user.avatar.file.allowedTypes,
                                maximumSize: config.user.avatar.file.maximumSize,
                                maxFiles: 1
                            }
                        ]
                    }
                ),
                handler: controller.updateUser
            }
        )
        .route(
            {
                method: 'GET',
                path: '/api/admin/user/:userId',
                schema: {
                    summary: 'Получить информацию о пользователе по id',
                    tags: ['User'],
                    params: schemas.GetUserByIdParams,
                    response: schemas.GetUserByIdResponses
                },
                onRequest: [security.authorization, security.isAdmin],
                handler: controller.getUser
            }
        )
        .route(
            {
                method: 'PATCH',
                path: '/api/admin/user/:userId',
                schema: {
                    summary: 'Обновить пользователя по id',
                    tags: ['User'],
                    params: schemas.UpdateUserByIdParams,
                    response: schemas.UpdateUserByIdResponses
                },
                onRequest: [security.authorization, security.isAdmin],
                preValidation: upload.formData(
                    {
                        jsonBodyKey: 'data',
                        files: [
                            {
                                key: 'avatar',
                                destination: config.path.productImage,
                                allowedTypes: config.product.image.file.allowedTypes,
                                maximumSize: config.product.image.file.maximumSize,
                                maxFiles: 1
                            }
                        ]
                    }
                ),
                handler: controller.updateUser
            }
        )
        .route(
            {
                method: 'GET',
                path: '/api/admin/users',
                schema: {
                    summary: 'Получить список пользователей',
                    tags: ['User'],
                    query: schemas.GetUsersListQuery,
                    response: schemas.GetUsersListResponses
                },
                onRequest: [security.authorization, security.isAdmin],
                handler: controller.getUsers
            }
        )
        .route(
            {
                method: 'DELETE',
                path: '/api/admin/user/:userId',
                schema: {
                    summary: 'Удалить пользователя по id',
                    tags: ['User'],
                    params: schemas.DeleteUserByIdParams,
                    response: schemas.DeleteUserByIdResponses
                },
                onRequest: [security.authorization, security.isAdmin],
                handler: controller.deleteUser
            }
        )
}