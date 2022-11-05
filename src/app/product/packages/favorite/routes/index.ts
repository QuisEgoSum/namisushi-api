import {loadRoutes} from '@utils/loader'
import type {FastifyInstance} from 'fastify'
import {FavoriteService} from '@app/product/packages/favorite/FavoriteService'


export async function routes(fastify: FastifyInstance, service: FavoriteService) {
  const routes = await loadRoutes<(fastify: FastifyInstance, service: FavoriteService) => Promise<FastifyInstance>>(__dirname)
  return Promise.all(routes.map(router => router(fastify, service)))
}