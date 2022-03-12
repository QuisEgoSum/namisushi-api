import {_id, cost, icon, show, title, weight, createdAt, updatedAt} from '@app/product/packages/variant/schemas/properties'
import {Types} from 'mongoose'


export interface BaseVariant {
  _id: Types.ObjectId | string
  title: string
  show: boolean
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
    show,
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
    'show',
    'icon',
    'cost',
    'weight',
    'createdAt',
    'updatedAt'
  ]
}

export interface CreateVariant {
  title: string
  show: boolean,
  icon: string | null
  cost: number
  weight: number
}

export const CreateVariant = {
  title: 'CreateVariant',
  type: 'object',
  properties: {
    title,
    show,
    icon,
    cost,
    weight
  },
  additionalProperties: false,
  required: [
    'title',
    'show',
    'icon',
    'cost',
    'weight'
  ]
}

export interface UpdateVariant {
  title: string
  show: boolean,
  icon: string | null
  cost: number
  weight: number
}

export const UpdateVariant = {
  title: 'UpdateVariant',
  type: 'object',
  properties: {
    title,
    show,
    icon,
    cost,
    weight
  },
  additionalProperties: false
}
