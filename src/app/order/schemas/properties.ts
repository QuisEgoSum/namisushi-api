import {ObjectId, Timestamp} from '@common/schemas/helpers'
import {phonePattern} from '@common/schemas/pattern'
import {OrderCondition} from '@app/order/OrderCondition'
import {OrderDiscount} from '@app/order/OrderDiscount'


export const _id = new ObjectId({errorMessage: 'Невалидный идентификатор заказа'})
export const client = new ObjectId({errorMessage: 'Невалидный идентификатор пользователя'})
export const productId = new ObjectId({errorMessage: 'Невалидный идентификатор продукта'})
export const variantId = new ObjectId({errorMessage: 'Невалидный идентификатор варианта продукта'})
export const number = {
  description: 'Номер заказа в системе',
  type: 'integer'
}
export const phone = {
  type: 'string',
  pattern: phonePattern,
  errorMessage: {
    type: 'Номер телефона должен быть строкой',
    pattern: 'Указанный номер телефона некорректен'
  }
}
export const address = {
  type: 'string',
  maxLength: 2048,
  errorMessage: {
    type: 'Адрес доставки должен быть строкой',
    maxLength: 'Адрес доставки должен не должен быть больше 2048 символов'
  }
}
export const cost = {
  description: 'Стоимость заказа без учёта доставки',
  type: 'integer',
  minimum: 0,
  errorMessage: {
    type: 'Стоимость заказа должно быть целым числом',
    minimum: 'Стоимость заказа не может быть меньше 0'
  }
}
export const weight = {
  description: 'Суммарный вес заказа в граммах',
  type: 'integer',
  minimum: 0,
  errorMessage: {
    type: 'Вес заказа должен быть целым числом',
    minimum: 'Вес заказа не может быть отрицательным'
  }
}
export const username = {
  description: 'Имя заказчика указанное при создании заказа',
  type: 'string',
  minLength: 1,
  maxLength: 64,
  errorMessage: {
    type: 'Имя пользователя должно быть строкой',
    minLength: 'Имя пользователя не должно быть короче 1 символа',
    maxLength: 'Имя пользователя не должно превышать 64 символа'
  }
}
export const deliveryCost = {
  description: 'Стоимость доставки заказа, null если стоимость невозможно расчитать',
  type: ['integer', 'null'],
  minimum: 0,
  errorMessage: {
    type: 'Стоимость заказа должна быть целым числом или null, если стомость невозможно расчитать',
    minimum: 'Стоимость заказа не может быть отрицательным числом'
  }
}
export const condition = {
  description: 'Статус заказа',
  type: 'integer',
  enum: Object.values(OrderCondition),
  errorMessage: {
    type: `Допустимые значения для фильтрации по статусам заказа: ${Object.values(OrderCondition)}`,
    enum: `Допустимые значения для фильтрации по статусам заказа: ${Object.values(OrderCondition)}`
  }
}
export const delivery = {
  description: 'Флаг, отвечающий за выбранную доставку. true - выбрана доставка, false - самовывоз.',
  type: 'boolean',
  errorMessage: {
    type: 'Флаг доставки должен быть логическим значением'
  }
}
export const discountType = {
  description: 'Идентификатор скидки, примененной к заказу',
  type: 'string',
  enum: Object.values(OrderDiscount)
}
export const additionalInformation = {
  description: 'Дополнительная информация',
  type: 'string',
  maxLength: 2048,
  errorMessage: {
    type: 'Дополнительная информация должна быть строкой',
    maxLength: 'Дополнительная информация не должен быть больше 2048 символов'
  }
}
export const deliveryCalculateManually = {
  description: 'Флаг отвечающий за ручное определение стоимости доставки',
  type: 'boolean',
  errorMessage: {
    type: 'Флаг отвечающий за ручное определение стоимости доставки должен быть логическим значением'
  }
}
export const time = {
  description: 'Время доставки. Не может быть меньше часа от текущего времени',
  type: 'integer',
  errorMessage: {
    type: 'Временная метка должна быть целым числом'
  }
}
export const numberOfProducts = {
  type: 'integer',
  minimum: 1,
  maximum: 100,
  errorMessage: {
    minimum: 'Количество выбранного продукта не может быть меньше одного',
    maximum: 'Количество выбранного продукта не может превышать 100'
  }
}
export const productCost = {
  description: 'Стоимость продукта на момент выполнения заказа',
  type: 'integer'
}
export const productWeight = {
  description: 'Стоимость продукта на момент выполнения заказа',
  type: 'integer'
}
export const isTestOrder = {
  type: 'boolean',
  default: false
}
export const createdAt = new Timestamp()
export const updatedAt = new Timestamp()