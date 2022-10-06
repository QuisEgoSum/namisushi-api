import {BaseRepositoryError} from './BaseRepositoryError'
import {DataList} from '@common/data'
import type {
  FilterQuery, QueryOptions, UpdateQuery,
  UpdateWithAggregationPipeline,
  UpdateWriteOpResult, ReturnsNewDoc, Model
} from 'mongoose'
import type {PageOptions} from '@core/repository'
import type {IBaseRepository} from '@core/repository/IBaseRepository'
import type {BulkWriteOptions, BulkWriteResult, AnyBulkWriteOperation, MongoServerError, DeleteResult} from 'mongodb'
import {Types} from 'mongoose'

export class BaseRepository<T> implements IBaseRepository<T> {
  constructor(
    public readonly Model: Model<T>
  ) {}

  static errorHandler(error: Error | MongoServerError) {
    // @ts-ignore - Because mongoose does not export the class MongoServerError
    if (error.name === 'MongoServerError' && error.code === 11000) {
      // @ts-ignore - Because mongoose does not export the class MongoServerError
      throw BaseRepositoryError.UniqueKeyError.fromMongooseError(error)
    } else {
      throw error
    }
  }

  async create(entity?: Partial<T>): Promise<T> {
    //@ts-ignore
    return new this.Model(entity)
      .save()
      .then(entity => entity.toJSON())
      .catch(error => BaseRepository.errorHandler(error))
  }

  updateOne(filter?: FilterQuery<T>, update?: UpdateQuery<T> | UpdateWithAggregationPipeline, options?: QueryOptions | null): Promise<UpdateWriteOpResult> {
    return this.Model
      .updateOne(filter, update, options)
      .exec()
      .catch(error => BaseRepository.errorHandler(error)) as unknown as Promise<UpdateWriteOpResult>
  }

  updateById(id: string | Types.ObjectId, update?: UpdateQuery<T> | UpdateWithAggregationPipeline, options?: QueryOptions | null): Promise<UpdateWriteOpResult> {
    return this.Model
      // @ts-ignore
      .updateOne({_id: new Types.ObjectId(id)}, update, options)
      .exec()
      .catch(error => BaseRepository.errorHandler(error)) as unknown as Promise<UpdateWriteOpResult>
  }

  findOneAndUpdate(filter: FilterQuery<T>, update: UpdateQuery<T>, options: Partial<QueryOptions & { upsert?: true } & ReturnsNewDoc> = {new: true}): Promise<T | null> {
    return this.Model
      .findOneAndUpdate(filter, update, options)
      .lean()
      .exec()
      .catch(error => BaseRepository.errorHandler(error)) as unknown as Promise<T | null>

  }

  findByIdAndUpdate(id: string | Types.ObjectId, update: UpdateQuery<T>, options: QueryOptions & { upsert?: true } & Partial<ReturnsNewDoc> = {new: true}): Promise<T | null> {
    return this.Model
      .findByIdAndUpdate(new Types.ObjectId(id), update, options)
      .lean()
      .exec()
      .catch(error => BaseRepository.errorHandler(error)) as unknown as Promise<T | null>
  }

  findOneAndDelete(filter?: FilterQuery<T>, options?: QueryOptions | null): Promise<T | null> {
    return this.Model
      .findOneAndDelete(filter, options)
      .lean()
      .exec() as unknown as Promise<T | null>
  }

  findByIdAndDelete(id: string | Types.ObjectId, options?: QueryOptions | null): Promise<T | null> {
    return this.Model
      .findByIdAndDelete(id, options)
      .lean()
      .exec() as unknown as Promise<T | null>
  }

  deleteOne(query: FilterQuery<T>): Promise<boolean> {
    return this.Model.deleteOne(query)
      .exec()
      .then(result => !!result.deletedCount)
  }

  deleteById(id: string | Types.ObjectId): Promise<boolean> {
    // @ts-ignore
    return this.Model
      .deleteOne({_id: new Types.ObjectId(id)})
      .exec()
      .then(result => !!result.deletedCount)
  }

  async find<I extends T>(filter: FilterQuery<I>, projection?: any | null, options?: QueryOptions | null): Promise<I[]> {
    return await this.Model.find(filter, projection, options)
      .lean()
      .exec() as unknown as Promise<I[]>
  }

  async findPage(page: PageOptions, filter: FilterQuery<T> = {}, projection?: unknown | null, options?: QueryOptions | null): Promise<DataList<T>> {
    const [data, total] = await Promise.all([
      this.Model
        .find(filter, projection, options)
        .skip(page.limit * (page.page - 1))
        .limit(page.limit)
        .lean()
        .exec(),
      this.Model
        .countDocuments(filter)
    ]) as unknown as [Array<T>, number] // ¯\_(ツ)_/¯

    return new DataList(total, Math.ceil(total / page.limit), data)
  }

  findById(id: string | Types.ObjectId, projection?: unknown | null, options?: QueryOptions | null): Promise<T | null> {
    return this.Model
      .findById(new Types.ObjectId(id), projection, options)
      .lean()
      .exec() as unknown as Promise<T | null>
  }

  findOne(query: FilterQuery<T>, projection?: unknown | null, options?: QueryOptions | null,) {
    return this.Model
      .findOne(query, projection, options)
      .lean()
      .exec() as unknown as Promise<T | null>
  }

  count(filter: FilterQuery<T>): Promise<number> {
    return this.Model
      .countDocuments(filter)
      .exec()
  }

  bulkWrite(writes: Array<AnyBulkWriteOperation<T>>, options?: BulkWriteOptions): Promise<BulkWriteResult> {
    return this.Model
      .bulkWrite(writes, options)
  }

  deleteMany(filter?: FilterQuery<T>, options?: QueryOptions): Promise<DeleteResult> {
    return this.Model
      .deleteMany(filter, options) as unknown as Promise<DeleteResult>
  }
}