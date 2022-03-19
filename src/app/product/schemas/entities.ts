import {
  _id, cost,
  createdAt,
  description,
  ingredients,
  visible,
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
    visible,
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
    'visible',
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
  visible: boolean
  title: string
  description: string
  ingredients: string[]
  images: string[]
  variants: BaseVariant[],
  createdAt: number
  updatedAt: number
}


export const VariantProduct = {
  title: 'VariantProduct',
  type: 'object',
  properties: {
    _id,
    title,
    description,
    ingredients,
    images,
    visible,
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
    'visible',
    'type',
    'variants',
    'createdAt',
    'updatedAt'
  ]
}

export const BaseProduct = {
  title: 'ProductBase',
  type: 'object',
  additionalProperties: true,
  oneOf: [SingleProduct, VariantProduct]
}

export interface CreateSingleProduct {
  title: string
  description: string
  ingredients: string[]
  visible: boolean
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
    visible,
    cost,
    weight
  },
  additionalProperties: false,
  required: [
    'title',
    'description',
    'ingredients',
    'visible',
    'cost',
    'weight'
  ],
  errorMessage: {
    required: {
      title: 'Укажите название продукта',
      description: 'Укажите описание продукта',
      ingredients: 'Укажите список ингридентов продукта',
      visible: 'Укажите статус отображения продукта',
      cost: 'Укажите стоимость продукта',
      weight: 'Укажите вес продукта'
    }
  }
}

export interface CreateVariantProduct {
  title: string
  description: string
  ingredients: string[]
  visible: boolean
}

export const CreateVariantProduct = {
  title: 'CreateVariantProduct',
  type: 'object',
  properties: {
    title,
    description,
    ingredients,
    visible
  },
  additionalProperties: false,
  required: [
    'title',
    'description',
    'ingredients',
    'visible'
  ],
  errorMessage: {
    required: {
      title: 'Укажите название продукта',
      description: 'Укажите описание продукта',
      ingredients: 'Укажите список ингридентов продукта',
      visible: 'Укажите статус отображения продукта',
    }
  }
}

export interface UpdateSingleProduct {
  title?: string
  description?: string
  ingredients?: string[]
  visible?: boolean
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
    visible,
    cost,
    weight
  },
  additionalProperties: false
}

export interface UpdateVariantProduct {
  title?: string
  description?: string
  ingredients?: string[]
  visible?: boolean
}

export const UpdateVariantProduct = {
  title: 'UpdateVariantProduct',
  type: 'object',
  properties: {
    title,
    description,
    ingredients,
    visible
  },
  additionalProperties: false
}

export const UpdateOrderImages = {
  title: 'UpdateOrderImages',
  type: 'object',
  properties: {
    images: {
      type: 'array',
      items: {type: 'string'},
      minItems: 0,
      errorMessage: {
        minItems: 'Вы отправили пустой список картинок'
      }
    }
  },
  additionalProperties: false,
  required: ['images'],
  errorMessage: {
    required: {
      images: 'Вы не отправили список картинок'
    }
  }
}

export interface OrderSingleProductList {
  _id: Types.ObjectId,
  cost: number,
  weight: number
}

export interface OrderVariantProductList {
  _id: Types.ObjectId,
  variants: {
    _id: Types.ObjectId,
    cost: number,
    weight: number
  }[]
}