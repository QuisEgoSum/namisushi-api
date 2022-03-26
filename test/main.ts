import path from 'path'
import {config, reloadConfigByPath} from '@config'
import {initApp} from '../src/init'
import {FastifyInstance} from 'fastify'
import mongoose from 'mongoose'
import {orderTests} from './order'
import {userTests} from './user'
import {productTests} from './product'



export interface TestOptions {
  fastify: FastifyInstance
  sessions: {
    admin: string
  }
  stateId: Map<string, string>
}

// @ts-ignore
const options: TestOptions = {fastify: null, sessions: {admin: ''}, stateId: new Map()}

beforeAll(async function() {
  await reloadConfigByPath(path.resolve(__dirname, '../config/test.yaml'))
  await mongoose.connect(config.database.credentials.connectionString)
  await mongoose.connection.dropDatabase()
  await mongoose.disconnect()
  const app = await initApp()
  options.fastify = app.http
})

describe("Пользователь", userTests(options))
describe("Продукт", productTests(options))
describe("Заказ", orderTests(options))


afterAll(async function() {
  await mongoose.disconnect()
})