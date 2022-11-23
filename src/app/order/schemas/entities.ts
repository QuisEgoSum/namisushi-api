import {
  _id, additionalInformation,
  address, clientId, condition,
  cost, createdAt, delivery,
  deliveryCalculateManually,
  deliveryCost, discountPercent, discountType, isTestOrder, number,
  numberOfProducts, phone, productCost,
  productId, productsSum, productWeight, time, timeResponse, updatedAt,
  username, variantId, weight
} from '@app/order/schemas/properties'
import {BaseProduct} from '@app/product/schemas/entities'
import {BaseVariant} from '@app/product/packages/variant/schemas/entities'
import {Types} from 'mongoose'
import {OrderCondition, OrderDiscount} from '@app/order'
import {IProduct} from '@app/product/ProductModel'
import {IVariant} from '@app/product/packages/variant/VariantModel'
import {IOrder} from '@app/order/OrderModel'
import {nullable} from '@common/schemas/transform'
import {SortDirection} from 'mongodb'
import {QueryPageLimit, QueryPageNumber, QuerySortDirection} from '@common/schemas/query'


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
      variantId: nullable(variantId),
      number: numberOfProducts,
      cost: productCost,
      weight: productWeight
    },
    additionalProperties: false,
    required: [
      'productId',
      'variantId',
      'number',
      'cost',
      'weight'
    ]
  },
  minItems: 1
}

export interface PopulateOrderedProduct {
  product: IProduct | null
  variant?: IVariant | null
  number: number
  cost: number
  weight: number
}

export const PopulatedOrderedProductList = {
  title: 'PopulateOrderedProductList',
  description: 'Список заказанных продуктов с объектами продуктов и вариантов',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      number: numberOfProducts,
      cost: productCost,
      weight: productWeight,
      product: nullable(BaseProduct),
      variant: nullable(BaseVariant)
    },
    additionalProperties: false,
    required: [
      'product',
      'variant',
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
    number,
    address,
    phone,
    username,
    delivery,
    deliveryCost,
    deliveryCalculateManually,
    cost,
    weight,
    condition,
    discount,
    additionalInformation,
    clientId,
    productsSum,
    products: OrderedProductList,
    isTestOrder,
    createdAt,
    updatedAt
  },
  additionalProperties: false,
  required: [
    '_id',
    'number',
    'clientId',
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

export interface RawPopulatedOrder extends IOrder {
  _products: IProduct[]
  _variants: IVariant[]
}

export interface PopulatedOrder {
  _id: Types.ObjectId
  number: number,
  //nullable Types.ObjectId ajv преобразовывает в null при наличии значения
  clientId: string | null
  phone: string
  address: string | null
  cost: number
  weight: number
  username: string
  condition: OrderCondition,
  delivery: boolean
  deliveryCost: number | null
  discount: {
    type: OrderDiscount,
    percent: number
  } | null
  additionalInformation: string | null
  deliveryCalculateManually: boolean | null
  time: number | null
  productsSum: number
  products: PopulateOrderedProduct[]
  isTestOrder: boolean
  createdAt: number
  updatedAt: number
}

export const PopulatedOrder = {
  title: 'PopulateOrder',
  type: 'object',
  properties: {
    _id,
    number,
    address,
    phone,
    username,
    delivery,
    deliveryCost,
    deliveryCalculateManually,
    cost,
    weight,
    condition,
    discount,
    additionalInformation,
    clientId,
    productsSum,
    products: PopulatedOrderedProductList,
    isTestOrder,
    time: timeResponse,
    createdAt,
    updatedAt
  },
  additionalProperties: false,
  required: [
    '_id',
    'number',
    'address',
    'phone',
    'username',
    'delivery',
    'deliveryCost',
    'deliveryCalculateManually',
    'cost',
    'weight',
    'condition',
    'discount',
    'additionalInformation',
    'clientId',
    'productsSum',
    'products',
    'isTestOrder',
    'time',
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
  clientId: Types.ObjectId
  time: number
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
    isTestOrder,
    time
  },
  additionalProperties: false,
  required: [
    'phone',
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

export interface FindQuery {
  page: number
  limit: number
  fCondition?: OrderCondition
  sCreatedAt: SortDirection
}

export interface FindQueryAdmin extends FindQuery {
  fClientId?: string
  fIsTestOrder?: boolean
}

export const FindQuery = {
  title: 'FindQuery',
  type: 'object',
  properties: {
    page: new QueryPageNumber().setDefault(1),
    limit: new QueryPageLimit().setDefault(10),
    sCreatedAt: new QuerySortDirection().setDefault("desc"),
    fCondition: condition
  },
  additionalProperties: false
}

export const FindQueryAdmin = {
  title: 'FindQueryAdmin',
  type: 'object',
  properties: {
    page: new QueryPageNumber().setDefault(1),
    limit: new QueryPageLimit().setDefault(10),
    sCreatedAt: new QuerySortDirection().setDefault("desc"),
    fClientId: clientId,
    fCondition: condition,
    fIsTestOrder: isTestOrder
  },
  additionalProperties: false
}

export interface PreviewExpandOrder {
  _id: Types.ObjectId
  number: number
  clientId: Types.ObjectId
  phone: string
  address: string | null
  cost: number
  username: string
  condition: string
  delivery: boolean
  discount: {
    type: OrderDiscount,
    percent: number
  } | null
  additionalInformation: string | null
  deliveryCalculateManually: boolean | null
  time: number | null
  createdAt: number
}

export const PreviewOrder = {
  title: 'PreviewOrder',
  type: 'object',
  properties: {
    _id,
    number,
    phone,
    address,
    cost,
    username,
    condition,
    delivery,
    discount,
    additionalInformation,
    deliveryCalculateManually,
    isTestOrder,
    time: timeResponse,
    createdAt
  },
  additionalProperties: false,
  required: [
    '_id',
    'number',
    'phone',
    'address',
    'cost',
    'username',
    'condition',
    'delivery',
    'discount',
    'additionalInformation',
    'deliveryCalculateManually',
    'time',
    'createdAt'
  ]
}

export interface UpdateCondition {
  condition: OrderCondition
}

export const UpdateCondition = {
  title: 'UpdateCondition',
  type: 'object',
  properties: {
    condition
  },
  additionalProperties: false,
  required: ['condition']
}