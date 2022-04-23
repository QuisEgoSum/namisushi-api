import fs from 'fs/promises'
import path from 'path'
import {config} from '@config'
import type {FastifyInstance} from 'fastify'



export async function getDocs(fastify: FastifyInstance) {
  const html = await fs.readFile(path.resolve(config.paths.root, 'static/redoc.html'), {encoding: 'utf-8'})
    .then(html => html.replace('{{DOC_URL}}', `${config.server.address.api}`))

  return fastify
    .route(
      {
        url: '/docs',
        method: 'GET',
        security: {
          auth: false
        },
        handler: async function(request, reply) {
          reply
            .code(200)
            .type('text/html')
            .send(html)
        }
      }
    )
}