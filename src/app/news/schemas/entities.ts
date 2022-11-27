import {ObjectSchemaRequired} from '@common/schemas/types'
import {
  _id,
  contentHtml,
  contentJson,
  createdAt,
  description,
  slug,
  title,
  updatedAt
} from '@app/news/schemas/properties'


export interface News {
  _id: string
  slug: string
}

export const News = new ObjectSchemaRequired(
  'News',
  {
    _id,
    slug,
    title,
    description,
    contentJson,
    contentHtml,
    createdAt,
    updatedAt
  }
)