import {
  _id, cost,
  createdAt,
  description,
  ingredients,
  show,
  title,
  typeSingle, typeVariant,
  updatedAt, weight, images
} from '@app/product/schemas/properties'
import {BaseVariant} from '@app/product/packages/variant/schemas/entities'
import {Types} from 'mongoose'
import {ProductType} from '@app/product/ProductType'


export const SingleProduct = {
  title: 'SingleProduct',
  type: 'object',
  properties: {
    _id,
    title,
    description,
    ingredients,
    images,
    show,
    type: typeSingle,
    cost,
    weight,
    createdAt,
    updatedAt
  },
  additionalProperties: false,
  required: [
    '_id',
    'title',
    'description',
    'ingredients',
    'images',
    'show',
    'type',
    'cost',
    'weight',
    'createdAt',
    'updatedAt'
  ]
}


export interface VariantProduct {
  _id: Types.ObjectId
  type: ProductType.VARIANT
  show: boolean
  title: string
  description: string
  ingredients: string[]
  images: string[]
  variants: BaseVariant[],
  createdAt: number
  updatedAt: number
}


export const VariantProduct = {
  title: 'SingleProduct',
  type: 'object',
  properties: {
    _id,
    title,
    description,
    ingredients,
    images,
    show,
    type: typeVariant,
    variants: {
      type: 'array',
      items: BaseVariant,
      default: []
    },
    createdAt,
    updatedAt
  },
  additionalProperties: false,
  required: [
    '_id',
    'title',
    'description',
    'ingredients',
    'images',
    'show',
    'type',
    'variants',
    'createdAt',
    'updatedAt'
  ]
}

export interface CreateSingleProduct {
  title: string
  description: string
  ingredients: string[]
  show: boolean
  cost: number
  weight: number
}

export const CreateSingleProduct = {
  title: 'CreateSingleProduct',
  type: 'object',
  properties: {
    title,
    description,
    ingredients,
    show,
    cost,
    weight
  },
  additionalProperties: false,
  required: [
    'title',
    'description',
    'ingredients',
    'show',
    'cost',
    'weight'
  ],
  errorMessage: {
    required: {
      title: 'Укажите название продукта',
      description: 'Укажите описание продукта',
      ingredients: 'Укажите список ингридентов продукта',
      show: 'Укажите статус отображения продукта',
      cost: 'Укажите стоимость продукта',
      weight: 'Укажите вес продукта'
    }
  }
}

export interface CreateVariantProduct {
  title: string
  description: string
  ingredients: string[]
  show: boolean
}

export const CreateVariantProduct = {
  title: 'CreateVariantProduct',
  type: 'object',
  properties: {
    title,
    description,
    ingredients,
    show
  },
  additionalProperties: false,
  required: [
    'title',
    'description',
    'ingredients',
    'show'
  ],
  errorMessage: {
    required: {
      title: 'Укажите название продукта',
      description: 'Укажите описание продукта',
      ingredients: 'Укажите список ингридентов продукта',
      show: 'Укажите статус отображения продукта',
    }
  }
}

export interface UpdateSingleProduct {
  title?: string
  description?: string
  ingredients?: string[]
  show?: boolean
  cost?: number
  weight?: number
}

export const UpdateSingleProduct = {
  title: 'UpdateSingleProduct',
  type: 'object',
  properties: {
    title,
    description,
    ingredients,
    show,
    cost,
    weight
  },
  additionalProperties: false
}