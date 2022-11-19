import {
  globalDiscountEnabled,
  globalDiscountPercent,
  infoMessage,
  infoMessageEnabled,
  theme
} from '@app/config/schemas/properties'
import {ObjectSchema, ObjectSchemaRequired} from '@common/schemas/types'

export const BaseConfig = new ObjectSchemaRequired(
  'Config',
  {
    theme,
    infoMessage,
    infoMessageEnabled,
    globalDiscountPercent,
    globalDiscountEnabled
  }
)


export interface UpdateConfig {
  theme?: string | null
  infoMessage?: string | null
  infoMessageEnabled?: boolean
  globalDiscountPercent?: number
  globalDiscountEnabled?: boolean
}


export const UpdateConfig = new ObjectSchema(
  'UpdateConfig',
  {
    theme,
    infoMessage,
    infoMessageEnabled,
    globalDiscountPercent,
    globalDiscountEnabled
  }
)