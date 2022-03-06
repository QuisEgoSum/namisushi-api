import {ObjectId} from '@common/schemas/helpers'


export const _id = new ObjectId({errorMessage: 'Невалидный уникальный идентификатор продукта'})
export const show = {type: 'boolean'}