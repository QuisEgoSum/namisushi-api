import {IBaseRepository, PageOptions} from '@core/repository/IBaseRepository'
import {
  FilterQuery,
  QueryOptions, ReturnsNewDoc,
  Types,
  UpdateQuery,
  UpdateWithAggregationPipeline,
  UpdateWriteOpResult
} from 'mongoose'
import {DataList} from '@common/data'
import {AnyBulkWriteOperation, BulkWriteOptions, BulkWriteResult, DeleteResult} from 'mongodb'


export interface IGenericRepository<T> extends IBaseRepository<T> {

  /**
   * @throws {UniqueKeyError}
   */
  create<I extends T>(entity?: Partial<I>): Promise<I>

  findById<I extends T>(id: string | Types.ObjectId, projection?: unknown | null, options?: QueryOptions | null): Promise<I | null>

  findOne<I extends T>(query: FilterQuery<I>, projection?: unknown | null, options?: QueryOptions | null): Promise<I | null>

  /**
   * @throws {UniqueKeyError}
   */
  updateOne<I extends T>(filter?: FilterQuery<I>, update?: UpdateQuery<I> | UpdateWithAggregationPipeline, options?: QueryOptions | null): Promise<UpdateWriteOpResult>

  /**
   * @throws {UniqueKeyError}
   */
  updateById<I extends T>(id: string | Types.ObjectId, update?: UpdateQuery<I> | UpdateWithAggregationPipeline, options?: QueryOptions | null): Promise<UpdateWriteOpResult>

  findOneAndUpdate<I extends T>(filter: FilterQuery<I>, update: UpdateQuery<I>, options?: QueryOptions & {upsert?: true} & ReturnsNewDoc): Promise<I | null>

  findByIdAndUpdate<I extends T>(id: string | Types.ObjectId, update: UpdateQuery<I>, options?: QueryOptions & {upsert?: true} & ReturnsNewDoc): Promise<I | null>

  findOneAndDelete<I extends T>(filter?: FilterQuery<I>, options?: QueryOptions | null): Promise<I | null>

  findByIdAndDelete<I extends T>(id: string | Types.ObjectId, options?: QueryOptions | null): Promise<I | null>

  find<I extends T>(filter: FilterQuery<I>, projection?: any | null, options?: QueryOptions | null): Promise<I[]>

  findPage<I extends T>(page: PageOptions, filter: FilterQuery<I>, projection?: unknown | null, options?: QueryOptions | null): Promise<DataList<I>>

  deleteOne<I extends T>(query: FilterQuery<I>): Promise<boolean>

  deleteById(id: string | Types.ObjectId): Promise<boolean>

  deleteMany<I extends T>(filter?: FilterQuery<I>, options?: QueryOptions): Promise<DeleteResult>

  count<I extends T>(filter: FilterQuery<I>): Promise<number>

  bulkWrite<I extends T>(writes: Array<AnyBulkWriteOperation<I>>, options?: BulkWriteOptions): Promise<BulkWriteResult>
}