import {BaseRepository, BaseRepositoryError} from '@core/repository'
import {EntityExistsError, EntityDoesNotExistError, NoDataForUpdatingError} from '@core/error'
import type {IBaseService} from './IBaseService'
import type {Types, UpdateQuery, FilterQuery, QueryOptions, ReturnsNewDoc} from 'mongoose'
import type {ServiceError} from '@core/service/index'


export class BaseService<T, R extends BaseRepository<T>, E = unknown> implements IBaseService<T, R, E> {
  public error: ServiceError & E

  constructor(
    public readonly repository: R,
    errors?: E
  ) {
    this.error = {
      EntityExistsError: EntityExistsError,
      EntityDoesNotExistError: EntityDoesNotExistError,
      ...(errors ? errors : {})
    } as ServiceError & E
  }

  errorHandler<T>(error: Error | BaseRepositoryError): T {
    if (error instanceof BaseRepositoryError.UniqueKeyError) {
      throw new this.error.EntityExistsError({key: error.key, value: error.value})
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
      throw new this.error.EntityDoesNotExistError()
    }
  }

  async findById(id: string | Types.ObjectId, projection?: unknown | null, options?: QueryOptions | null): Promise<T> {
    const document = await this.repository.findById(id, projection, options)
    if (document === null) {
      throw new this.error.EntityDoesNotExistError()
    }
    return document
  }

  async findByIdAndDelete(id: string | Types.ObjectId): Promise<T> {
    const document = await this.repository.findByIdAndDelete(id)
    if (document === null) {
      throw new this.error.EntityDoesNotExistError()
    }
    return document
  }

  async findByIdAndUpdate(id: string | Types.ObjectId, update: Partial<T>): Promise<T> {
    this.checkUpdateData(update)
    const document = await this.repository.findByIdAndUpdate(id, update, {new: true})
      .catch(error => this.errorHandler(error))
    if (document === null) {
      throw new this.error.EntityDoesNotExistError()
    }
    return document
  }

  async findOne(filter: FilterQuery<T> = {}, projection?: unknown | null, options?: QueryOptions | null): Promise<T> {
    const document = await this.repository.findOne(filter, projection, options)
    if (document === null) {
      throw new this.error.EntityDoesNotExistError()
    }
    return document
  }

  async deleteOne(query: FilterQuery<T>): Promise<void> {
    const isDeleted = await this.repository.deleteOne(query)
    if (!isDeleted) {
      throw new this.error.EntityDoesNotExistError()
    }
  }

  async findOneAndUpdate(filter: FilterQuery<T>, update: UpdateQuery<T>, options?: QueryOptions & {upsert?: true} & ReturnsNewDoc): Promise<T> {
    this.checkUpdateData(update)
    const document = await this.repository.findOneAndUpdate(filter, update, options)
      .catch(error => this.errorHandler(error))
    if (document === null) {
      throw new this.error.EntityDoesNotExistError()
    }
    return document
  }

  async findOneAndDelete(filter?: FilterQuery<T>, options?: QueryOptions | null): Promise<T> {
    const document = await this.repository.findOneAndDelete(filter, options)
    if (document === null) {
      throw new this.error.EntityDoesNotExistError()
    }
    return document
  }

  async updateOne(filter?: FilterQuery<T>, update?: UpdateQuery<T>, options?: QueryOptions | null): Promise<void> {
    this.checkUpdateData(update)
    const result = await this.repository.updateOne(filter, update, options)
      .catch(error => this.errorHandler(error))
    if (result.matchedCount === 0) {
      throw new this.error.EntityDoesNotExistError()
    }
  }


  async updateById(id: string | Types.ObjectId, update?: UpdateQuery<T>, options?: QueryOptions | null): Promise<void> {
    this.checkUpdateData(update)
    const result = await this.repository.updateById(id, update, options)
      .catch(error => this.errorHandler(error))
    if (result.matchedCount === 0) {
      throw new this.error.EntityDoesNotExistError()
    }
  }

  async existsById(id: string | Types.ObjectId): Promise<void> {
    await this.findById(id, {_id: 1})
  }
}