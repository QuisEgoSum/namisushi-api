import type {IGenericRepository} from '@core/repository/IGenericRepository'
import type {ServiceError} from '@core/service/index'
import type {FilterQuery, QueryOptions, ReturnsNewDoc, Types, UpdateQuery, UpdateWithAggregationPipeline} from 'mongoose'


export interface IGenericService<T, R extends IGenericRepository<T>, E = unknown> {
  repository: R

  error: ServiceError & E

  /**
   * @throws {EntityExistsError}
   */
  create<I extends T>(entity: Partial<I>): Promise<I>

  /**
   * @throws {EntityDoesNotExistError}
   */
  findById<I extends T>(id: string | Types.ObjectId, projection?: unknown | null, options?: QueryOptions | null): Promise<I>

  /**
   * @throws {EntityExistsError | EntityDoesNotExistError}
   */
  findByIdAndUpdate<I extends T>(id: string, update: Partial<I>): Promise<I>

  /**
   * @throws {EntityDoesNotExistError}
   */
  findByIdAndDelete<I extends T>(id: string): Promise<I>

  /**
   * @throws {EntityDoesNotExistError}
   */
  deleteById(id: string): Promise<void>

  deleteOne<I extends T>(query: FilterQuery<I>): Promise<void>

  /**
   * @throws {EntityExistsError | EntityDoesNotExistError}
   */
  findOneAndUpdate<I extends T>(filter: FilterQuery<I>, update: UpdateQuery<I>, options: QueryOptions & { upsert: true } & ReturnsNewDoc): Promise<I>

  findOne<I extends T>(filter: FilterQuery<I>, projection?: unknown | null, options?: QueryOptions | null): Promise<I>

  findOneAndDelete<I extends T>(filter?: FilterQuery<I>, options?: QueryOptions | null): Promise<I>

  /**
   * @throws {EntityExistsError}
   */
  updateOne<I extends T>(filter?: FilterQuery<I>, update?: UpdateQuery<I> | UpdateWithAggregationPipeline, options?: QueryOptions | null): Promise<void>

  /**
   * @throws {EntityExistsError}
   */
  updateById<I extends T>(id: string | Types.ObjectId, update?: UpdateQuery<I> | UpdateWithAggregationPipeline, options?: QueryOptions | null): Promise<void>

  existsById(id: string | Types.ObjectId): Promise<void>
}