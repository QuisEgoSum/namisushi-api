const {getTags, createTag, updateTag, deleteTag} = require('./controller')
const security = require('../../../../helpers/security')
const upload = require('./upload')
const schemes = require('./schemes')
const commonSchemes = require('../../../../common/schemas')


module.exports = async function(fastify) {
    fastify
        // .route(
        //     {
        //         method: 'GET',
        //         path: '/api/admin/product/tags',
        //         schema: {
        //             response: {
        //                 200: schemes.tagsResponse,
        //                 401: commonSchemes.message,
        //                 403: commonSchemes.message
        //             }
        //         },
        //         onRequest: [security.authorization, security.isAdmin],
        //         handler: getTags
        //     }
        // )
        // .route(
        //     {
        //         method: 'POST',
        //         path: '/api/admin/product/tag',
        //         schema: {
        //             response: {
        //                 201: schemes.tagResponse,
        //                 400: commonSchemes.message,
        //                 401: commonSchemes.message,
        //                 403: commonSchemes.message
        //             }
        //         },
        //         onRequest: [security.authorization, security.isAdmin],
        //         preHandler: upload.tagIcon,
        //         handler: createTag
        //     }
        // )
        // .route(
        //     {
        //         method: 'PATCH',
        //         path: '/api/admin/product/tag/:tagId',
        //         schema: {
        //             params: commonSchemes.mongoId('tagId'),
        //             response: {
        //                 200: schemes.tagResponse,
        //                 400: commonSchemes.message,
        //                 401: commonSchemes.message,
        //                 403: commonSchemes.message
        //             }
        //         },
        //         onRequest: [security.authorization, security.isAdmin],
        //         preHandler: upload.tagIcon,
        //         handler: updateTag
        //     }
        // )
        // .route(
        //     {
        //         method: 'DELETE',
        //         path: '/api/admin/product/tag/:tagId',
        //         schema: {
        //             params: commonSchemes.mongoId('tagId'),
        //             response: {
        //                 200: commonSchemes.message
        //             }
        //         },
        //         onRequest: [security.authorization, security.isAdmin],
        //         handler: deleteTag
        //     }
        // )
}