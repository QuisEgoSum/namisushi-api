import {
  FilterQuery, Model,
  QueryOptions, ReturnsNewDoc,
  Types,
  UpdateQuery,
  UpdateWithAggregationPipeline,
  UpdateWriteOpResult
} from 'mongoose'
import {IGenericRepository} from '@core/repository/IGenericRepository'
import {PageOptions} from '@core/repository/IBaseRepository'
import {DataList} from '@common/data'
import {AnyBulkWriteOperation, BulkWriteOptions, BulkWriteResult, DeleteResult, MongoServerError} from 'mongodb'
import {BaseRepositoryError} from '@core/repository/BaseRepositoryError'
import {BaseRepository} from '@core/repository/BaseRepository'


export abstract class GenericRepository<T> implements IGenericRepository<T> {
  public readonly Model: Model<T>

  protected constructor(model: Model<T>) {
    this.Model = model
  }

  static errorHandler(error: Error | MongoServerError) {
    // @ts-ignore - Because mongoose does not export the class MongoServerError
    if (error.name === 'MongoServerError' && error.code === 11000) {
      // @ts-ignore - Because mongoose does not export the class MongoServerError
      throw BaseRepositoryError.UniqueKeyError.fromMongooseError(error)
    } else {
      throw error
    }
  }


  async create<I extends T>(entity?: Partial<I>): Promise<I> {
    //@ts-ignore
    return await new this.Model(entity)
      .save()
      .then(entity => entity.toJSON())
      .catch(error => GenericRepository.errorHandler(error))
  }

  async findById<I extends T>(id: string | Types.ObjectId, projection?: unknown | null, options?: QueryOptions | null): Promise<I | null> {
    return await this.Model
      .findById(new Types.ObjectId(id), projection, options)
      .lean()
      .exec() as unknown as Promise<I | null>
  }

  async findOne<I extends T>(query: FilterQuery<I>, projection?: unknown | null, options?: QueryOptions | null): Promise<I | null> {
    return await this.Model
      .findOne(query, projection, options)
      .lean()
      .exec() as unknown as Promise<I | null>
  }

  async updateOne<I extends T>(filter?: FilterQuery<I>, update?: UpdateQuery<I> | UpdateWithAggregationPipeline, options?: QueryOptions | null): Promise<UpdateWriteOpResult> {
    return await this.Model
      .updateOne(filter, update, options)
      .exec()
      .catch(error => GenericRepository.errorHandler(error)) as unknown as Promise<UpdateWriteOpResult>
  }

  async updateById<I extends T>(id: string | Types.ObjectId, update?: UpdateQuery<I> | UpdateWithAggregationPipeline, options?: QueryOptions | null): Promise<UpdateWriteOpResult> {
    return await this.Model
      // @ts-ignore
      .updateOne({_id: new Types.ObjectId(id)}, update, options)
      .exec()
      .catch(error => GenericRepository.errorHandler(error)) as unknown as Promise<UpdateWriteOpResult>
  }

  async findOneAndUpdate<I extends T>(filter: FilterQuery<I>, update: UpdateQuery<I>, options?: QueryOptions & {upsert?: true} & ReturnsNewDoc): Promise<I | null> {
    return await this.Model
      .findOneAndUpdate(filter, update, options)
      .lean()
      .exec()
      .catch(error => GenericRepository.errorHandler(error)) as unknown as Promise<I | null>
  }

  async findByIdAndUpdate<I extends T>(id: string | Types.ObjectId, update: UpdateQuery<I>, options?: QueryOptions & {upsert?: true} & ReturnsNewDoc): Promise<I | null> {
    return await this.Model
      .findByIdAndUpdate(new Types.ObjectId(id), update, options)
      .lean()
      .exec()
      .catch(error => GenericRepository.errorHandler(error)) as unknown as Promise<I | null>
  }

  async findOneAndDelete<I extends T>(filter?: FilterQuery<I>, options?: QueryOptions | null): Promise<I | null> {
    return await this.Model
      .findOneAndDelete(filter, options)
      .lean()
      .exec() as unknown as Promise<I | null>
  }

  async findByIdAndDelete<I extends T>(id: string | Types.ObjectId, options?: QueryOptions | null): Promise<I | null> {
    return await this.Model
      .findByIdAndDelete(id, options)
      .lean()
      .exec() as unknown as Promise<I | null>
  }

  async find<I extends T>(filter: FilterQuery<I>, projection?: any | null, options?: QueryOptions | null): Promise<I[]> {
    return await this.Model.find(filter, projection, options)
      .lean()
      .exec() as unknown as Promise<I[]>
  }

  async findPage<I extends T>(page: PageOptions, filter: FilterQuery<I> = {}, projection?: unknown | null, options?: QueryOptions | null): Promise<DataList<I>> {
    const [data, total] = await Promise.all([
      this.Model
        .find(filter, projection, options)
        .skip(page.limit * (page.page - 1))
        .limit(page.limit)
        .lean()
        .exec(),
      this.Model
        .countDocuments(filter)
    ]) as unknown as [Array<I>, number] // ¯\_(ツ)_/¯

    return new DataList(total, Math.ceil(total / page.limit), data)
  }

  async deleteOne<I extends T>(query: FilterQuery<I>): Promise<boolean> {
    return await this.Model.deleteOne(query)
      .exec()
      .then(result => !!result.deletedCount)
  }

  async deleteById(id: string | Types.ObjectId): Promise<boolean> {
    // @ts-ignore
    return await this.Model
      .deleteOne({_id: new Types.ObjectId(id)})
      .exec()
      .then(result => !!result.deletedCount)
  }

  async deleteMany<I extends T>(filter?: FilterQuery<I>, options?: QueryOptions): Promise<DeleteResult> {
    return await this.Model
      .deleteMany(filter, options) as unknown as Promise<DeleteResult>
  }

  async count<I extends T>(filter: FilterQuery<I>): Promise<number> {
    return await this.Model
      .countDocuments(filter)
      .exec()
  }

  async bulkWrite<I extends T>(writes: Array<AnyBulkWriteOperation<I>>, options?: BulkWriteOptions): Promise<BulkWriteResult> {
    return await this.Model
      .bulkWrite(writes, options)
  }
}