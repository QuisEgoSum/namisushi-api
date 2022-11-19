import {ConfigService} from '@app/config/ConfigService'
import {ConfigRepository} from '@app/config/ConfigRepository'
import {ConfigModel} from '@app/config/ConfigModel'
import {FastifyInstance} from 'fastify'
import {routes} from '@app/config/routes'


class Config {
  constructor(
    public readonly service: ConfigService
  ) {
    this.router = this.router.bind(this)
  }

  async router(fastify: FastifyInstance) {
    await routes(fastify, this.service)
  }
}


export async function initConfig() {
  const service = new ConfigService(new ConfigRepository(ConfigModel))
  await service.upsert()
  return new Config(service)
}

export type {
  Config
}


