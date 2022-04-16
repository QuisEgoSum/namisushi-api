import {config} from '@core/config'
import {DocsTags} from '@app/docs/DocsTags'


export const swagger: Record<string, any> = {
  mode: 'dynamic',
  exposeRoute: true,
  routePrefix: '/docs/swagger',
  hideUntagged: true,
  openapi: {
    info: {
      title: config.pkgJson.name,
      version: config.pkgJson.version
    },
    components: {
      securitySchemes: {
        UserSession: {
          type: 'apiKey',
          name: 'sessionId',
          in: 'cookie'
        }
      }
    },
    tags: [],
    'x-tagGroups': [
      {
        name: 'Пользователь',
        tags: [
          DocsTags.USER,
          DocsTags.ADMIN
        ]
      },
      {
        name: 'Продукт',
        tags: [
          DocsTags.PRODUCT,
          DocsTags.PRODUCT_ADMIN,
          DocsTags.CATEGORY_ADMIN,
          DocsTags.VARIANT_ADMIN
        ]
      },
      {
        name: 'Заказ',
        tags: [
          DocsTags.ORDER
        ]
      }
    ]
  }
}