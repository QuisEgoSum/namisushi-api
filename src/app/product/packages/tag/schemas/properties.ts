import {ObjectId, Timestamp} from '@common/schemas/helpers'


export const _id = new ObjectId({entity: 'tag'})
export const name = {
  type: 'string',
  minLength: 1,
  maxLength: 24,
  errorMessage: {
    minLength: 'Название тэга должно иметь как минимум 1 символ',
    maxLength: 'Название тэга должно иметь не более 24 символов'
  }
}
export const icon = {
  type: 'string',
  example: '2bd4706e-6fb0-4ee8-b847-e6d34069acbe.svg'
}
export const createdAt = new Timestamp()
export const updatedAt = new Timestamp()