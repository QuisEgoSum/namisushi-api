import {ObjectId} from '@common/schemas/helpers'
import {INTEGER, STRING} from '@common/schemas/types'


export const _id = new ObjectId()
export const slug = {
  type: 'string',
  minLength: 1,
  maxLength: 256
}
export const title = {
  type: 'string',
  minLength: 1,
  maxLength: 512
}
export const description = {
  type: 'string',
  minLength: 1
}
export const contentJson = {
  type: 'object',
  additionalProperties: true
}
export const contentHtml = STRING
export const createdAt = INTEGER
export const updatedAt = INTEGER
