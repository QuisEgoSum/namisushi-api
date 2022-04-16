import type {
  FilterQuery,
  QueryOptions,
  Types,
  UpdateQuery,
  UpdateWithAggregationPipeline,
  UpdateWriteOpResult
} from 'mongoose'
import type {DataList} from '@common/data'
import type mongoose from 'mongoose'
import type {ReturnsNewDoc} from 'mongoose'
import type {BulkWriteOptions, BulkWriteResult, AnyBulkWriteOperation} from 'mongodb'
import type {PageOptions} from '@core/repository'


export interface IBaseRepository<T> {

  /**
   * @throws {UniqueKeyError}
   */
  create(entity: T): Promise<T>

  findById(id: string | Types.ObjectId, projection?: unknown | null, options?: QueryOptions | null): Promise<T | null>

  findOne(query: FilterQuery<T>, projection?: unknown | null, options?: QueryOptions | null): Promise<T | null>

  /**
   * @throws {UniqueKeyError}
   */
  updateOne(filter?: FilterQuery<T>, update?: UpdateQuery<T> | UpdateWithAggregationPipeline, options?: QueryOptions | null): Promise<UpdateWriteOpResult>

  /**
   * @throws {UniqueKeyError}
   */
  updateById(id: string | mongoose.Types.ObjectId, update?: UpdateQuery<T> | UpdateWithAggregationPipeline, options?: QueryOptions | null): Promise<UpdateWriteOpResult>

  findOneAndUpdate(filter: FilterQuery<T>, update: UpdateQuery<T>, options: QueryOptions & { upsert: true } & ReturnsNewDoc): Promise<T | null>

  findByIdAndUpdate(id: string | mongoose.Types.ObjectId, update: UpdateQuery<T>, options: QueryOptions & { upsert: true } & ReturnsNewDoc): Promise<T | null>

  find(filter: FilterQuery<T>, projection?: any | null, options?: QueryOptions | null): Promise<T[]>

  findPage(page: PageOptions, filter: FilterQuery<T>, projection?: unknown | null, options?: QueryOptions | null): Promise<DataList<T>>

  findOneAndDelete(filter?: FilterQuery<T>, options?: QueryOptions | null): Promise<T | null>

  findByIdAndDelete(id: string | mongoose.Types.ObjectId, options?: QueryOptions | null): Promise<T | null>

  deleteOne(query: FilterQuery<T>): Promise<boolean>

  deleteById(id: string | Types.ObjectId): Promise<boolean>

  count(filter?: FilterQuery<T>): Promise<number>

  bulkWrite(writes: Array<AnyBulkWriteOperation<T>>, options?: BulkWriteOptions): Promise<BulkWriteResult>
}