import {_id, createdAt, productIds, title, updatedAt} from '@app/product/packages/category/schemas/properties'


export const BaseCategory = {
  title: 'BaseCategory',
  type: 'object',
  properties: {
    _id,
    title,
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
}

export const CreateCategory = {
  title: 'CreateCategory',
  type: 'object',
  properties: {
    title
  },
  additionalProperties: false,
  required: ['title'],
  errorMessage: {
    required: {
      title: 'Укажите название категории'
    }
  }
}

export interface UpdateCategory {
  title: string
}

export const UpdateCategory = {
  title: 'UpdateCategory',
  type: 'object',
  properties: {
    title
  },
  additionalProperties: false,
  required: ['title'],
  errorMessage: {
    required: {
      title: 'Укажите название категории'
    }
  }
}