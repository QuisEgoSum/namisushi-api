import mongoose from 'mongoose'
import {BaseRepository} from './BaseRepository'
import {BaseRepositoryError} from './BaseRepositoryError'
import * as assert from 'assert'


interface IModel {
  _id: mongoose.Types.ObjectId,
  test: string,
  test2: number,
  createdAt: number,
  updatedAt: number
}

const ModelSchema = new mongoose.Schema<IModel>(
  {
    test: {
      type: String
    },
    test2: {
      type: Number
    },
    createdAt: {
      type: Number
    },
    updatedAt: Number
  },
  {
    timestamps: true,
    versionKey: false
  }
)
  .index({test: 1}, {unique: true})
  .index({test2: 1}, {unique: true})

const ModelModel = mongoose.model<IModel>('Model', ModelSchema, 'models')


const modelRepository = new BaseRepository<IModel>(ModelModel)


before(async () => {
  await mongoose.connect('mongodb://localhost/base-repository-test')
  await ModelModel.deleteMany()
  console.log('Connection to database and delete models')
})

describe('BaseRepository', function() {

  const state: {[key in string]: any} = {
    model: null
  }

  it('Create', async function() {
    const model = await modelRepository.create({test: 'test', test2: 1})
    state.model = model
    assert.equal('_id' in model, true, 'Not exists _id in saved document')
    assert.equal('test' in model, true, 'Not exists test in saved document')
    assert.equal('createdAt' in model, true, 'Not exists createdAt in saved document')
    assert.equal('updatedAt' in model, true, 'Not exists updatedAt in saved document')
  })

  it('Create - unique error', async function() {
    try {
      await modelRepository.create({test: 'test', test2: 1})
      assert.fail('Not throw error')
    } catch (error) {
      assert.equal(error instanceof Error, true)
      assert.equal(error instanceof BaseRepositoryError, true)
      assert.equal(error instanceof BaseRepositoryError.UniqueKeyError, true)
    }
  })

  it('Find', async function() {
    const list = await modelRepository.findPage({limit: 10, page: 1})

    assert.equal(list.total, 1)
    assert.equal(list.pages, 1)
    assert.equal(list.data[0].test, 'test')
  })

  it('FindById', async function() {
    const model = await modelRepository.findById(state.model._id, {_id: 1, test: 1, createdAt: 1})
    // @ts-ignore
    assert.equal('_id' in model, true, 'Not exists _id in saved document')
    // @ts-ignore
    assert.equal('test' in model, true, 'Not exists test in saved document')
    // @ts-ignore
    assert.equal('createdAt' in model, true, 'Not exists createdAt in saved document')
    // @ts-ignore
    assert.equal('updatedAt' in model, false, 'Exists updatedAt in saved document')
  })

  // it('Update one', async function() {
  //   const result = await modelRepository.findByIdAndUpdate('', {})
  // })
})

after(async () => {
  await mongoose.disconnect()
  process.exit(0)
})

