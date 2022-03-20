import {_id, createdAt, productIds, title, updatedAt, visible} from '@app/product/packages/category/schemas/properties'


export const BaseCategory = {
  title: 'BaseCategory',
  type: 'object',
  properties: {
    _id,
    title,
    visible,
    productIds,
    createdAt,
    updatedAt
  },
  additionalProperties: false,
  required: [
    '_id',
    'title',
    'productIds',
    'createdAt',
    'updatedAt'
  ]
}

export interface CreateCategory {
  title: string
  visible: boolean
}

export const CreateCategory = {
  title: 'CreateCategory',
  type: 'object',
  properties: {
    title,
    visible
  },
  additionalProperties: false,
  required: ['title', 'visible'],
  errorMessage: {
    required: {
      title: 'Укажите название категории',
      visible: 'Укажите является ли категория видимой'
    }
  }
}

export interface UpdateCategory {
  title: string
  visible: boolean
}

export const UpdateCategory = {
  title: 'UpdateCategory',
  type: 'object',
  properties: {
    title,
    visible
  },
  additionalProperties: false
}