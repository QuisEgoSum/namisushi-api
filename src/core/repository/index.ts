/**
 * Does anyone know what's wrong with mongoose types?
 */
import {BaseRepository} from './BaseRepository'
import {BaseRepositoryError} from './BaseRepositoryError'
import {GenericRepository} from './GenericRepository'
import {IBaseRepository} from './IBaseRepository'
import {IGenericRepository} from './IGenericRepository'


type PageOptions = {
  limit: number,
  page: number
}

export {
  BaseRepository,
  GenericRepository,
  BaseRepositoryError
}

export type {
  IBaseRepository,
  IGenericRepository,
  PageOptions
}