const fastify = require('fastify').fastify(
    {
        trustProxy: true
    }
)
const fastifyCookie = require('fastify-cookie')
const fastifyCors = require('fastify-cors')
const fastifyHelmet = require('fastify-helmet')
const validation = require('../../utils/validation')
const errorHandler = require('./error-handler')
const swagger = require('./swagger')
const config = require('../../config')


const createHttpServer = () => {
    fastify
        .addHook('onRoute', swagger.onRouteHandler)
        .setValidatorCompiler(({schema}) => validation.ajv.compile(schema))
        .setSchemaErrorFormatter(validation.schemaErrorFormatter)
        .setErrorHandler(errorHandler.handler)
        .setNotFoundHandler(errorHandler.error404)
        .register(require('fastify-multipart'), {
            addToBody: true
        })
        .register(fastifyCookie)
        .register(fastifyCors,
            {
                origin: config.server.allowedOrigins,
                optionsSuccessStatus: 204,
                methods: 'GET, PATCH, POST, DELETE, OPTIONS',
                credentials: true,
                allowedHeaders: config.server.allowedHeaders
            }
        )
        .register(fastifyHelmet,
            {
                contentSecurityPolicy: config.server.contentSecurityPolicy
            }
        )
        .register(require('fastify-swagger'), swagger.mainSchema)
        .register(require('core/user/user-http-router'))
        .register(require('core/product/product-http-router'))
        .register(require('core/order/order-http-router'))
        .register(require('core/docs/docs-http-router'))

    return fastify
}


module.exports = createHttpServer