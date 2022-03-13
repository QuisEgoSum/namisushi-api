import {_id, cost, icon, visible, title, weight, createdAt, updatedAt} from '@app/product/packages/variant/schemas/properties'
import {Types} from 'mongoose'


export interface BaseVariant {
  _id: Types.ObjectId | string
  title: string
  visible: boolean
  icon: string | null
  cost: number
  weight: number
  createdAt: number
  updatedAt: number
}

export const BaseVariant = {
  title: 'BaseVariant',
  type: 'object',
  properties: {
    _id,
    title,
    visible,
    icon,
    cost,
    weight,
    createdAt,
    updatedAt
  },
  additionalProperties: false,
  required: [
    '_id',
    'title',
    'visible',
    'icon',
    'cost',
    'weight',
    'createdAt',
    'updatedAt'
  ]
}

export interface CreateVariant {
  title: string
  visible: boolean,
  icon: string | null
  cost: number
  weight: number
}

export const CreateVariant = {
  title: 'CreateVariant',
  type: 'object',
  properties: {
    title,
    visible,
    icon,
    cost,
    weight
  },
  additionalProperties: false,
  required: [
    'title',
    'visible',
    'icon',
    'cost',
    'weight'
  ]
}

export interface UpdateVariant {
  title: string
  visible: boolean,
  icon: string | null
  cost: number
  weight: number
}

export const UpdateVariant = {
  title: 'UpdateVariant',
  type: 'object',
  properties: {
    title,
    visible,
    icon,
    cost,
    weight
  },
  additionalProperties: false
}
