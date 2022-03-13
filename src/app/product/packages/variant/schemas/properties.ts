import {ObjectId, Timestamp} from '@common/schemas/helpers'


export const _id = new ObjectId({errorMessage: 'Невалидный идентификатор варианта продукта'})
export const productId = new ObjectId({errorMessage: 'Невалидный идентификатор продукта'})
export const title = {
  type: 'string',
  minLength: 1,
  maxLength: 64,
  errorMessage: {
    minLength: 'Название продукта должно иметь не менее 1 символа',
    maxLength: 'Название продукта не должно превышать 64 символа'
  }
}
export const visible = {type: 'boolean'}
export const weight = {
  description: 'Вес в граммах',
  type: 'integer',
  minimum: 0,
  maximum: 100000,
  errorMessage: {
    type: 'Вес продукта должен быть целым не отрицательным числом',
    minimum: 'Вес продукта не можеть быть отрицательным',
    maximum: 'Вес продукта не может превышать 100000'
  }
}
export const icon = {
  description: 'Raw SVG',
  type: ['string', 'null'],
  maxLength: 10000,
  errorMessage: {
    maxLength: 'Размер иконки не должен превышать 10000 символов'
  }
}
export const cost = {
  type: 'integer',
  minimum: 0,
  maximum: 100000,
  errorMessage: {
    type: 'Цена продукта должна быть целым не отрицательным числом',
    minimum: 'Цена продукта не может быть отрицательной',
    maximum: 'Цена продукта не может превышать 100000'
  }
}
export const createdAt = new Timestamp()
export const updatedAt = new Timestamp()