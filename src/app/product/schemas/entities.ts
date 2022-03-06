import {_id} from '@app/product/schemas/properties'


export const SingleProduct = {
  title: 'SingleProduct',
  type: 'object',
  properties: {
    _id
  },
  additionalProperties: false,
  required: ['_id']
}