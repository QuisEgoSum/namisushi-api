import type {BaseRepository} from '../repository'
import type {ServiceError} from '@core/service/index'
import type {FilterQuery, QueryOptions, ReturnsNewDoc, Types, UpdateQuery, UpdateWithAggregationPipeline} from 'mongoose'


export interface IBaseService<T, R extends BaseRepository<T>> {
  repository: R

  error: ServiceError

  /**
   * @throws {EntityExistsError}
   */
  create(entity: Partial<T>): Promise<T>

  /**
   * @throws {EntityDoesNotExistError}
   */
  findById(id: string | Types.ObjectId, projection?: unknown | null, options?: QueryOptions | null): Promise<T>

  /**
   * @throws {EntityExistsError | EntityDoesNotExistError}
   */
  findByIdAndUpdate(id: string, update: Partial<T>): Promise<T>

  /**
   * @throws {EntityDoesNotExistError}
   */
  findByIdAndDelete(id: string): Promise<T>

  /**
   * @throws {EntityDoesNotExistError}
   */
  deleteById(id: string): Promise<void>

  deleteOne(query: FilterQuery<T>): Promise<void>

  findOneAndUpdate(filter: FilterQuery<T>, update: UpdateQuery<T>, options: QueryOptions & { upsert: true } & ReturnsNewDoc): Promise<T>

  findOne(filter: FilterQuery<T>, projection?: unknown | null, options?: QueryOptions | null): Promise<T>

  findOneAndDelete(filter?: FilterQuery<T>, options?: QueryOptions | null): Promise<T>

  /**
   * @throws {EntityExistsError}
   */
  updateOne(filter?: FilterQuery<T>, update?: UpdateQuery<T> | UpdateWithAggregationPipeline, options?: QueryOptions | null): Promise<void>

  /**
   * @throws {EntityExistsError}
   */
  updateById(id: string | Types.ObjectId, update?: UpdateQuery<T> | UpdateWithAggregationPipeline, options?: QueryOptions | null): Promise<void>
  
  existsById(id: string | Types.ObjectId): Promise<void>
}