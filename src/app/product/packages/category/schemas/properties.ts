import {ObjectId, Timestamp} from '@common/schemas/helpers'


export const _id = new ObjectId({errorMessage: 'Невалидный идентификатор коллекции'})
export const title = {
  description: 'Название категории',
  type: 'string',
  maxLength: 64,
  minLength: 1,
  errorMessage: {
    type: 'Название категории должно быть строкой',
    maxLength: 'Название категории не может быть длиннее 64 символов',
    minLength: 'Название категории не может быть короче 1 символа'
  }
}
export const productIds = {
  type: 'array',
  items: new ObjectId()
}
export const createdAt = new Timestamp()
export const updatedAt = new Timestamp()