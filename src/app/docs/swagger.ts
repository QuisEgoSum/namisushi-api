import {config} from '@core/config'
import {DocsTags} from '@app/docs/DocsTags'
import * as fs from 'fs'
import * as path from 'path'


export const swagger: Record<string, any> = {
  mode: 'dynamic',
  exposeRoute: true,
  routePrefix: '/docs/swagger',
  hideUntagged: true,
  openapi: {
    info: {
      title: config.pkgJson.name,
      version: config.pkgJson.version,
      description: fs.readFileSync(path.resolve(config.paths.root, './docs/DESCRIPTION.md'), 'utf-8')
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
          DocsTags.PRODUCT_FAVORITE,
          DocsTags.PRODUCT_ADMIN,
          DocsTags.CATEGORY_ADMIN,
          DocsTags.VARIANT_ADMIN,
          DocsTags.PRODUCT_TAG_ADMIN
        ]
      },
      {
        name: 'Заказ',
        tags: [
          DocsTags.ORDER,
          DocsTags.ORDER_ADMIN
        ]
      },
      {
        name: 'Конфигурация',
        tags: [
          DocsTags.CONFIG,
          DocsTags.CONFIG_ADMIN
        ]
      }
    ]
  }
}