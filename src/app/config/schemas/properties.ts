import {BOOLEAN, BOOLEAN_NULLABLE, STRING_NULLABLE} from '@common/schemas/types'


export const theme = STRING_NULLABLE
export const infoMessage = STRING_NULLABLE
export const infoMessageEnabled = BOOLEAN_NULLABLE
export const globalDiscountPercent = {type: 'integer', minimum: 0, maximum: 100}
export const globalDiscountEnabled = BOOLEAN
