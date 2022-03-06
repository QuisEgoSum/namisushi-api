import type {BaseRepository} from '../repository'
import type {
  FilterQuery,
  QueryOptions,
  ReturnsNewDoc,
  Types,
  UpdateQuery,
  UpdateWithAggregationPipeline
} from 'mongoose'


export interface IBaseService<T, R extends BaseRepository<T>> {
  repository: R

  /**
   * @throws {EntityExistsError}
   */
  create(entity: Partial<T>): Promise<T>

  /**
   * @throws {EntityNotExistsError}
   */
  findById(id: string | Types.ObjectId, projection?: unknown | null, options?: QueryOptions | null): Promise<T>

  /**
   * @throws {EntityExistsError | EntityNotExistsError}
   */
  findByIdAndUpdate(id: string, update: Partial<T>): Promise<T>

  /**
   * @throws {EntityNotExistsError}
   */
  findByIdAndDelete(id: string): Promise<T>

  /**
   * @throws {EntityNotExistsError}
   */
  deleteById(id: string): Promise<void>

  deleteOne(query: FilterQuery<T>): Promise<void>

  findOneAndUpdate(filter: FilterQuery<T>, update: UpdateQuery<T>, options: QueryOptions & { upsert: true } & ReturnsNewDoc): Promise<T>

  findOne(filter: FilterQuery<T>, projection?: unknown | null, options?: QueryOptions | null): Promise<T>

  findOneAndDelete(filter?: FilterQuery<T>, options?: QueryOptions | null): Promise<T>

  /**
   * @throws {UniqueKeyError}
   */
  updateOne(filter?: FilterQuery<T>, update?: UpdateQuery<T> | UpdateWithAggregationPipeline, options?: QueryOptions | null): Promise<void>

  /**
   * @throws {UniqueKeyError}
   */
  updateById(id: string | Types.ObjectId, update?: UpdateQuery<T> | UpdateWithAggregationPipeline, options?: QueryOptions | null): Promise<void>
  
  existsById(id: string | Types.ObjectId): Promise<void>
}