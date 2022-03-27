import path from 'path'
import {config, reloadConfigByPath} from '@config'
import {initApp} from '../src/init'
import {FastifyInstance} from 'fastify'
import mongoose from 'mongoose'
import {userTests} from './user'
import {categoryTests} from './category'
import {productTests} from './product'
import {orderTests} from './order'
import {InjectOptions, Response as LightMyRequestResponse} from 'light-my-request'



export interface TestOptions {
  fastify: FastifyInstance
  sessions: {
    admin: string
  }
  stateId: Map<string, string>
  adminInject: (opts: InjectOptions | string) => Promise<LightMyRequestResponse>
}

const options: TestOptions = {
  // @ts-ignore
  fastify: null,
  sessions: {admin: ''},
  stateId: new Map(),
  adminInject(opts: InjectOptions | string): Promise<LightMyRequestResponse> {
    if (typeof opts === 'string') opts = {url: opts}
    if (!opts.cookies) opts.cookies = {}
    opts.cookies.sessionId = this.sessions.admin
    return this.fastify.inject(opts)
  }
}

beforeAll(async function() {
  await reloadConfigByPath(path.resolve(__dirname, '../config/test.yaml'))
  await mongoose.connect(config.database.credentials.connectionString)
  await mongoose.connection.dropDatabase()
  await mongoose.disconnect()
  const app = await initApp()
  options.fastify = app.http
})

describe("Пользователь", userTests(options))
describe("Категории", categoryTests(options))
describe("Продукт", productTests(options))
describe("Заказ", orderTests(options))


afterAll(async function() {
  await mongoose.disconnect()
})