import {BaseRepositoryError} from '@core/repository'
import {EntityExistsError, EntityDoesNotExistError, NoDataForUpdatingError} from '@core/error'
import type {
  Types,
  UpdateQuery,
  FilterQuery,
  QueryOptions,
  ReturnsNewDoc,
  UpdateWithAggregationPipeline
} from 'mongoose'
import {IGenericRepository} from '@core/repository/IGenericRepository'
import {IGenericService} from '@core/service/IGenericService'
import type {ServiceError} from '@core/service/index'


export class GenericService<T, R extends IGenericRepository<T>> implements IGenericService<T, R> {
  public Error: ServiceError

  public repository: R

  constructor(repository: R) {
    this.repository = repository
    this.Error = {
      EntityExistsError: EntityExistsError,
      EntityDoesNotExistError: EntityDoesNotExistError
    }
  }

  errorHandler<T>(error: Error | BaseRepositoryError): T {
    if (error instanceof BaseRepositoryError.UniqueKeyError) {
      throw new this.Error.EntityExistsError(error)
    } else {
      throw error
    }
  }

  public checkUpdateData(data?: Record<string, any>) {
    if (!data || !Object.keys(data).length) {
      throw new NoDataForUpdatingError()
    }
  }

  async create<I extends T>(entity: Partial<I>): Promise<I> {
    return this.repository.create<I>(entity)
      .catch(error => this.errorHandler(error))
  }

  async deleteById(id: string): Promise<void> {
    const isDeleted = await this.repository.deleteById(id)

    if (!isDeleted) {
      throw new this.Error.EntityDoesNotExistError()
    }
  }

  async findById<I extends T>(id: string | Types.ObjectId, projection?: unknown | null, options?: QueryOptions | null): Promise<I> {
    const document = await this.repository.findById<I>(id, projection, options)

    if (document === null) {
      throw new this.Error.EntityDoesNotExistError()
    }

    return document
  }

  async findByIdAndDelete<I extends T>(id: string): Promise<I> {
    const document = await this.repository.findByIdAndDelete<I>(id)

    if (document === null) {
      throw new this.Error.EntityDoesNotExistError()
    }

    return document
  }

  async findByIdAndUpdate<I extends T>(id: string, update: Partial<I>): Promise<I> {
    this.checkUpdateData(update)
    const document = await this.repository.findByIdAndUpdate<I>(id, update, {new: true})

    if (document === null) {
      throw new this.Error.EntityDoesNotExistError()
    }

    return document
  }

  async findOne<I extends T>(filter: FilterQuery<I>, projection?: unknown | null, options?: QueryOptions | null): Promise<I> {
    const document = await this.repository.findOne<I>(filter, projection, options)

    if (document === null) {
      throw new this.Error.EntityDoesNotExistError()
    }

    return document
  }

  async deleteOne<I extends T>(query: FilterQuery<I>): Promise<void> {
    const isDeleted = await this.repository.deleteOne<I>(query)

    if (!isDeleted) {
      throw new this.Error.EntityDoesNotExistError()
    }
  }

  async findOneAndUpdate<I extends T>(filter: FilterQuery<I>, update: UpdateQuery<I>, options: QueryOptions & { upsert: true } & ReturnsNewDoc): Promise<I> {
    this.checkUpdateData(update)
    const document = await this.repository.findOneAndUpdate<I>(filter, update, options)
      .catch(error => this.errorHandler(error))

    if (document === null) {
      throw new this.Error.EntityDoesNotExistError()
    }

    return document
  }

  async findOneAndDelete<I extends T>(filter?: FilterQuery<I>, options?: QueryOptions | null): Promise<I> {
    const document = await this.repository.findOneAndDelete<I>(filter, options)

    if (document === null) {
      throw new this.Error.EntityDoesNotExistError()
    }

    return document
  }

  async updateOne<I extends T>(filter?: FilterQuery<I>, update?: UpdateQuery<I> | UpdateWithAggregationPipeline, options?: QueryOptions | null): Promise<void> {
    this.checkUpdateData(update)
    const result = await this.repository.updateOne<I>(filter, update, options)
      .catch(error => this.errorHandler(error))

    if (result.matchedCount === 0) {
      throw new this.Error.EntityDoesNotExistError()
    }
  }


  async updateById<I extends T>(id: string | Types.ObjectId, update?: UpdateQuery<I> | UpdateWithAggregationPipeline, options?: QueryOptions | null): Promise<void> {
    this.checkUpdateData(update)
    const result = await this.repository.updateById<I>(id, update, options)
      .catch(error => this.errorHandler(error))

    if (result.matchedCount === 0) {
      throw new this.Error.EntityDoesNotExistError()
    }
  }

  async existsById(id: string | Types.ObjectId): Promise<void> {
    await this.findById(id, {_id: 1})
  }
}