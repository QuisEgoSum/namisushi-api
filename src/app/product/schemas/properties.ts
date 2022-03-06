import {ObjectId, Timestamp} from '@common/schemas/helpers'
import {ProductType} from '@app/product/ProductType'


export const _id = new ObjectId({errorMessage: 'Невалидный уникальный идентификатор продукта'})
export const show = {type: 'boolean'}
export const title = {
  type: 'string',
  minLength: 1,
  maxLength: 64,
  errorMessage: {
    minLength: 'Название продукта должно иметь не менее 1 символа',
    maxLength: 'Название продукта не должно превышать 64 символа'
  }
}
export const description = {
  type: 'string',
  minLength: 1,
  maxLength: 2048,
  errorMessage: {
    minLength: 'Описание продукта должно иметь не менее 1 символа',
    maxLength: 'Описание продукта не должно превышать 2048 символов'
  }
}
export const ingredients = {
  type: 'array',
  items: {
    type: 'string',
    minLength: 1,
    maxLength: 128,
    errorMessage: {
      minLength: 'Название ингредиента должно иметь не менее 1 символа',
      maxLength: 'Название игнридиента не должно превышать 128 символов'
    }
  }
}
export const createdAt = new Timestamp()
export const updatedAt = new Timestamp()
export const type = {
  type: 'string',
  enum: Object.values(ProductType),
  errorMessage: {
    enum: `Допустимые типы продукта: ${Object.values(ProductType).join(', ')}`
  }
}
export const typeSingle = {
  type: 'string',
  enum: [ProductType.SINGLE],
  errorMessage: {
    enum: 'Тип продукта должен был быть указан как SINGLE'
  }
}
export const typeVariant = {
  type: 'string',
  enum: [ProductType.VARIANT],
  errorMessage: {
    enum: 'Тип продукта должен был быть указан как VARIANT'
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
export const variant = {
  type: 'object',
  properties: {
    _id: new ObjectId(),
    title: title,
    cost: cost,
    weight: weight
  },
  additionalProperties: false,
  required: ['_id', 'title', 'cost', 'weight']
}
export const variants = {
  type: 'array',
  items: variant
}