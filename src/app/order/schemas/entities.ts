import {
  _id, additionalInformation,
  address, client, condition,
  cost, createdAt, delivery,
  deliveryCalculateManually,
  deliveryCost, discountPercent, discountType, isTestOrder,
  numberOfProducts, phone, productCost,
  productId, productWeight, updatedAt,
  username, variantId, weight
} from '@app/order/schemas/properties'


export const discount = {
  type: ['object', 'null'],
  properties: {
    type: discountType,
    percent: discountPercent
  },
  additionalProperties: false,
  required: ['type', 'percent']
}

export const OrderedProductList = {
  title: 'OrderedProductList',
  description: 'Список заказанных продуктов',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      productId,
      variantId,
      number: numberOfProducts,
      cost: productCost,
      weight: productWeight
    },
    additionalProperties: false,
    required: [
      'productId',
      'number',
      'cost',
      'weight'
    ]
  },
  minItems: 1
}

export const CreateOrderProductList = {
  title: 'CreateOrderProductList',
  description: 'Список выбранных продуктов для заказа',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      productId,
      variantId,
      number: numberOfProducts
    },
    additionalProperties: false,
    required: [
      'productId',
      'number'
    ],
    errorMessage: {
      required: {
        productId: 'Не указан идентификатор выбранного продукта',
        number: 'Не указано количество выбранного продукта'
      }
    }
  },
  minItems: 1,
  maxItems: 100,
  errorMessage: {
    minItems: 'Выберите хотя бы 1 продук',
    maxItems: 'Вы не можете заказать больше 100 продуктов в одном заказе'
  }
}

export const BaseOrder = {
  title: 'BaseOrder',
  type: 'object',
  properties: {
    _id,
    client,
    phone,
    address,
    cost,
    weight,
    username,
    condition,
    delivery,
    deliveryCost,
    discount,
    additionalInformation,
    deliveryCalculateManually,
    products: OrderedProductList,
    isTestOrder,
    createdAt,
    updatedAt
  },
  additionalProperties: false,
  required: [
    '_id',
    'client',
    'phone',
    'cost',
    'weight',
    'username',
    'condition',
    'delivery',
    'products',
    'isTestOrder',
    'createdAt',
    'updatedAt'
  ]
}

export interface CreateOrderSingleProduct {
  productId: string
  number: number
}

export interface CreateOrderVariantProduct {
  productId: string
  number: number
  variantId: string
}

export type CreateOrderProduct = CreateOrderSingleProduct | CreateOrderVariantProduct

export interface CreateOrder {
  phone: string,
  address: string
  username: string
  delivery: boolean
  deliveryCost?: number | null
  additionalInformation?: string
  products: CreateOrderProduct[]
  isTestOrder: boolean
}

export const CreateOrder = {
  title: 'CreateOrder',
  type: 'object',
  properties: {
    phone,
    address,
    username,
    delivery,
    deliveryCost,
    additionalInformation,
    products: CreateOrderProductList,
    isTestOrder
  },
  additionalProperties: false,
  required: [
    'phone',
    'address',
    'username',
    'delivery',
    'products'
  ],
  errorMessage: {
    required: {
      phone: 'Укажите номер телефона',
      username: 'Укажите имя',
      delivery: 'Выберите доставку или самовывоз',
      products: 'Выберите список продуктов'
    }
  }
}