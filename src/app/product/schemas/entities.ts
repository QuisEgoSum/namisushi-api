import {
  _id, cost,
  createdAt,
  description,
  ingredients,
  show,
  title,
  typeSingle, typeVariant,
  updatedAt, variants, weight, icon, images
} from '@app/product/schemas/properties'


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
  variants: {
    title: string
    icon: string
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
          icon,
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
      minItems: 2,
      errorMessage: {
        minItems: 'Вариантов продукта должно быть не менее двух'
      }
    }
  },
  additionalProperties: false,
  required: [
    'title',
    'description',
    'ingredients',
    'show',
    'variants'
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