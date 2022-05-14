import {_id, name, icon, createdAt, updatedAt} from './properties'
import {config} from '@core/config'
import {FastifyMultipartSchema} from '@common/schemas/payload'
import type {MultipartFile} from '@fastify/multipart'


export const BaseTag = {
  title: 'BaseTag',
  type: 'object',
  properties: {_id, name, icon, createdAt, updatedAt},
  additionalProperties: false,
  required: ['_id', 'name', 'icon', 'createdAt', 'updatedAt']
}

export interface CreateTag {
  name: string
  icon: MultipartFile[]
}

export const CreateTag = {
  title: 'CreateTag',
  type: 'object',
  properties: {
    name,
    icon: new FastifyMultipartSchema(
      {
        maximum: 1,
        minimum: 1,
        maximumFileSize: config.product.tag.icon.maximumSize,
        allowedMimetypes: ['image/svg+xml']
      }
    )
  },
  additionalProperties: false,
  required: ['name', 'icon']
}