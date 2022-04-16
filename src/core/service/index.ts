import {IBaseService} from '@core/service/IBaseService'
import {BaseService} from '@core/service/BaseService'
import {IGenericService} from '@core/service/IGenericService'
import {GenericService} from '@core/service/GenericService'
import type {EntityExistsError, EntityDoesNotExistError} from '@error'


type ServiceError = {
  EntityExistsError: typeof EntityExistsError,
  EntityDoesNotExistError: typeof EntityDoesNotExistError
}

export {
  BaseService,
  GenericService
}

export type {
  IBaseService,
  IGenericService,
  ServiceError
}