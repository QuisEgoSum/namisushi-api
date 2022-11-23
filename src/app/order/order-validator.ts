import {ajv} from '@core/validation'


ajv.addKeyword(
  {
    keyword: 'orderTime',
    validate: (_: any, data: number) => data - Date.now() > 3600000,
    error: {message: 'Отложенный заказ можно создать только через час от текущего времени'}
  }
)