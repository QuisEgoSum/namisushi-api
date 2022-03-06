import type {
  FilterQuery,
  QueryOptions,
  ReturnsNewDoc,
  Types,
  UpdateQuery,
  UpdateWithAggregationPipeline
} from 'mongoose'
import {IGenericRepository} from '@core/repository/IGenericRepository'


export interface IGenericService<T, R extends IGenericRepository<T>> {
  repository: R

  /**
   * @throws {EntityExistsError}
   */
  create<I extends T>(entity: Partial<I>): Promise<I>

  /**
   * @throws {EntityNotExistsError}
   */
  findById<I extends T>(id: string | Types.ObjectId, projection?: unknown | null, options?: QueryOptions | null): Promise<I>

  /**
   * @throws {EntityExistsError | EntityNotExistsError}
   */
  findByIdAndUpdate<I extends T>(id: string, update: Partial<I>): Promise<I>

  /**
   * @throws {EntityNotExistsError}
   */
  findByIdAndDelete<I extends T>(id: string): Promise<I>

  /**
   * @throws {EntityNotExistsError}
   */
  deleteById(id: string): Promise<void>

  deleteOne<I extends T>(query: FilterQuery<I>): Promise<void>

  findOneAndUpdate<I extends T>(filter: FilterQuery<I>, update: UpdateQuery<I>, options: QueryOptions & { upsert: true } & ReturnsNewDoc): Promise<I>

  findOne<I extends T>(filter: FilterQuery<I>, projection?: unknown | null, options?: QueryOptions | null): Promise<I>

  findOneAndDelete<I extends T>(filter?: FilterQuery<I>, options?: QueryOptions | null): Promise<I>

  /**
   * @throws {UniqueKeyError}
   */
  updateOne<I extends T>(filter?: FilterQuery<I>, update?: UpdateQuery<I> | UpdateWithAggregationPipeline, options?: QueryOptions | null): Promise<void>

  /**
   * @throws {UniqueKeyError}
   */
  updateById<I extends T>(id: string | Types.ObjectId, update?: UpdateQuery<I> | UpdateWithAggregationPipeline, options?: QueryOptions | null): Promise<void>

  existsById(id: string | Types.ObjectId): Promise<void>
}