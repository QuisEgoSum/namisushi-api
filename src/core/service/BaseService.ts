import {BaseRepository, BaseRepositoryError} from '@core/repository'
import {EntityExistsError, EntityDoesNotExistError, NoDataForUpdatingError} from '@core/error'
import type {IBaseService} from './IBaseService'
import type {
  Types,
  UpdateQuery,
  FilterQuery,
  QueryOptions,
  ReturnsNewDoc,
  UpdateWithAggregationPipeline
} from 'mongoose'


export class BaseService<T, R extends BaseRepository<T>> implements IBaseService<T, R> {
  public Error: {
    EntityExistsError: typeof EntityExistsError,
    EntityNotExistsError: typeof EntityDoesNotExistError
  }

  public repository: R

  constructor(repository: R) {
    this.repository = repository
    this.Error = {
      EntityExistsError: EntityExistsError,
      EntityNotExistsError: EntityDoesNotExistError
    }
  }

  errorHandler(error: Error | BaseRepositoryError): T {
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

  async create(entity: Partial<T>): Promise<T> {
    return this.repository.create(entity)
      .catch(error => this.errorHandler(error))
  }

  async deleteById(id: string): Promise<void> {
    const isDeleted = await this.repository.deleteById(id)

    if (!isDeleted) {
      throw new this.Error.EntityNotExistsError()
    }
  }

  async findById(id: string | Types.ObjectId, projection?: unknown | null, options?: QueryOptions | null): Promise<T> {
    const document = await this.repository.findById(id, projection, options)

    if (document === null) {
      throw new this.Error.EntityNotExistsError()
    }

    return document
  }

  async findByIdAndDelete(id: string | Types.ObjectId): Promise<T> {
    const document = await this.repository.findByIdAndDelete(id)

    if (document === null) {
      throw new this.Error.EntityNotExistsError()
    }

    return document
  }

  async findByIdAndUpdate(id: string | Types.ObjectId, update: Partial<T>): Promise<T> {
    this.checkUpdateData(update)
    const document = await this.repository.findByIdAndUpdate(id, update, {new: true})

    if (document === null) {
      throw new this.Error.EntityNotExistsError()
    }

    return document
  }

  async findOne(filter: FilterQuery<T>, projection?: unknown | null, options?: QueryOptions | null): Promise<T> {
    const document = await this.repository.findOne(filter, projection, options)

    if (document === null) {
      throw new this.Error.EntityNotExistsError()
    }

    return document
  }

  async deleteOne(query: FilterQuery<T>): Promise<void> {
    const isDeleted = await this.repository.deleteOne(query)

    if (!isDeleted) {
      throw new this.Error.EntityNotExistsError()
    }
  }

  async findOneAndUpdate(filter: FilterQuery<T>, update: UpdateQuery<T>, options?: QueryOptions & {upsert?: true} & ReturnsNewDoc): Promise<T> {
    this.checkUpdateData(update)
    const document = await this.repository.findOneAndUpdate(filter, update, options)

    if (document === null) {
      throw new this.Error.EntityNotExistsError()
    }

    return document
  }

  async findOneAndDelete(filter?: FilterQuery<T>, options?: QueryOptions | null): Promise<T> {
    const document = await this.repository.findOneAndDelete(filter, options)

    if (document === null) {
      throw new this.Error.EntityNotExistsError()
    }

    return document
  }

  async updateOne(filter?: FilterQuery<T>, update?: UpdateQuery<T>, options?: QueryOptions | null): Promise<void> {
    this.checkUpdateData(update)
    const result = await this.repository.updateOne(filter, update, options)

    if (result.matchedCount === 0) {
      throw new this.Error.EntityNotExistsError()
    }
  }


  async updateById(id: string | Types.ObjectId, update?: UpdateQuery<T>, options?: QueryOptions | null): Promise<void> {
    this.checkUpdateData(update)
    const result = await this.repository.updateById(id, update, options)

    if (result.matchedCount === 0) {
      throw new this.Error.EntityNotExistsError()
    }
  }

  async existsById(id: string | Types.ObjectId): Promise<void> {
    await this.findById(id, {_id: 1})
  }
}