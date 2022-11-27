import {BaseService} from '@core/service'
import {INews} from '@app/news/NewsModel'
import {NewsRepository} from '@app/news/NewsRepository'
import {NewsQuery} from '@app/news/schemas/entities'
import {BaseRepositoryError} from '@core/repository'
import * as error from './news-error'
import {Types} from 'mongoose'


export class NewsService extends BaseService<INews, NewsRepository, typeof error> {
  constructor(repository: NewsRepository) {
    super(repository)

    Object.assign(this.error, error)
    this.error.EntityDoesNotExistError = error.NewsNotExistError
  }

  errorHandler<T>(error: Error | BaseRepositoryError): T {
    if (error instanceof BaseRepositoryError.UniqueKeyError) {
      if (error.key === 'title') {
        throw new this.error.NewsWithTitleAlreadyExistError({key: error.key, value: error.value})
      } else {
        throw new this.error.NewsWithSlugAlreadyExistError({key: error.key, value: error.value})
      }
    } else {
      throw error
    }
  }

  async deleteById(id: string) {
    await this.updateOne(
      {_id: new Types.ObjectId(id), isDeleted: false},
      {isDeleted: true}
    )
  }

  async find(query: NewsQuery) {
    return await this.repository.findPage(
      query,
      {isDeleted: false},
      {_id: 1, title: 1, slug: 1, description: 1, createdAt: 1, updatedAt: 1},
      {sort: {createdAt: -1}}
    )
  }

  async findBySlug(slug: string) {
    return await this.findOne(
      {slug: slug, isDeleted: false}
    )
  }
}