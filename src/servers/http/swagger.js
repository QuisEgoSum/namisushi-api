const pkgJson = require('../../../package.json')



module.exports.onRouteHandler = route => {
    if (!route.schema.consumes) {
        route.schema.consumes = ['application/json']
    }

    if (!route.schema.produces) {
        route.schema.produces = ['application/json']
    }

    if (route.config?.auth !== false && !route.schema.security) {
        route.schema.security = [{UserAuth: []}]
    }
}


module.exports.mainSchema = {
    exposeRoute: true,
    routePrefix: '/api/docs/swagger',
    consumes: ['application/json'],
    produces: ['application/json'],
    hideUntagged: true,
    swagger: {
        info: {
            title: 'NAMI API',
            version: pkgJson.version
        },
        securityDefinitions: {
            UserAuth: {
                type: 'apiKey',
                in: 'cookie',
                name: 'authorization'
            }
        }
    }
}