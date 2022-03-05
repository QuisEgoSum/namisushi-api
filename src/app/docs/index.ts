import {routes} from './routes'
import type {FastifyInstance} from 'fastify'


class Docs {
  public swagger: typeof import('./swagger').swagger
  constructor(
    swagger: typeof import('./swagger').swagger
  ) {
    this.swagger = swagger

    this.router = this.router.bind(this)
  }
  async router(fastify: FastifyInstance) {
    await routes(fastify)
  }
}


export async function initDocs(): Promise<Docs> {
  return new Docs((await import('./swagger')).swagger)
}