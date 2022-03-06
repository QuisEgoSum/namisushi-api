import {
  _id, cost,
  createdAt,
  description,
  ingredients,
  show,
  title,
  typeSingle, typeVariant,
  updatedAt, variants, weight
} from '@app/product/schemas/properties'


export const SingleProduct = {
  title: 'SingleProduct',
  type: 'object',
  properties: {
    _id,
    title,
    description,
    ingredients,
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
    'show',
    'type',
    'cost',
    'weight',
    'createdAt',
    'updatedAt'
  ]
}

export const VariantProduct = {
  title: 'SingleProduct',
  type: 'object',
  properties: {
    _id,
    title,
    description,
    ingredients,
    show,
    type: typeVariant,
    variants,
    createdAt,
    updatedAt
  },
  additionalProperties: false,
  required: [
    '_id',
    'title',
    'description',
    'ingredients',
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
  variants: {
    title: string
    cost: number
    weight: number
  }[]
}

export const CreateVariantProduct = {
  title: 'CreateVariantProduct',
  type: 'object',
  properties: {
    title,
    description,
    ingredients,
    show,
    variants: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title,
          cost,
          weight
        },
        additionalProperties: false,
        required: ['title', 'cost', 'weight'],
        errorMessage: {
          required: {
            title: 'Укажите название варианта продукта',
            cost: 'Укажите стоимость варианта продукта',
            weight: 'Укажите вес варианта продукта'
          }
        }
      },
      minItems: 2
    }
  },
  additionalProperties: false,
  required: [
    'title',
    'description',
    'ingredients',
    'show',
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