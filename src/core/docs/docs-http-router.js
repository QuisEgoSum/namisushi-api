const fs = require('fs')
const path = require('path')
const config = require('@config')


const docsHtml = fs.readFileSync(path.resolve(__dirname, './docs.html'), {encoding: 'utf-8'})
    .toString()
    .replace('{{SERVER_DOMAIN}}}', config.server.http.protocol + '://' + config.server.domain)


module.exports = async function(fastify) {
    fastify
        .route(
            {
                method: 'GET',
                path: '/api/docs',
                schema: {
                    summary: 'Получить документацию',
                    tags: ['Docs']
                },
                handler: async function(request, reply) {
                    reply
                        .type('text/html')
                        .send(docsHtml)

                }
            }
        )
}