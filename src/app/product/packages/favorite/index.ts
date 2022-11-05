import {routes} from '@app/product/packages/favorite/routes'
import * as error from '@app/product/packages/favorite/favorite-error'
import {FastifyInstance} from 'fastify'
import {FavoriteService} from '@app/product/packages/favorite/FavoriteService'
import {FavoriteModel, IFavorite} from '@app/product/packages/favorite/FavoriteModel'
import {FavoriteRepository} from '@app/product/packages/favorite/FavoriteRepository'


class Favorite {
  public readonly error: typeof error

  constructor(
    public readonly service: FavoriteService
  ) {
    this.error = error
  }

  async router(fastify: FastifyInstance) {
    await routes(fastify, this.service)
  }
}


export async function initFavorite() {
  return new Favorite(new FavoriteService(new FavoriteRepository(FavoriteModel)))
}

export {
  error
}

export type {
  Favorite,
  IFavorite,
  FavoriteService
}