import {routes} from '@app/file/routes'
import {FastifyInstance} from 'fastify'


class File {
  async router(fastify: FastifyInstance) {
    await routes(fastify)
  }
}


export async function initFile() {
  return new File()
}


export type {
  File
}