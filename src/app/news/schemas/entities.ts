import {ObjectSchema, ObjectSchemaRequired} from '@common/schemas/types'
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
import {QueryPageLimit, QueryPageNumber} from '@common/schemas/query'


export interface News {
  _id: string
  slug: string
  title: string
  description: string
  createdAt: number
  updatedAt: number
}

export const News = new ObjectSchemaRequired(
  'News',
  {
    _id,
    slug,
    title,
    description,
    createdAt,
    updatedAt
  }
)

export interface NewsExpand {
  _id: string
  slug: string
  title: string
  description: string
  contentJson: object
  contentHtml: string
  createdAt: number
  updatedAt: number
}

export const NewsExpand = new ObjectSchemaRequired(
  'NewsExpand',
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

export interface CreateNews {
  slug: string
  title: string
  description: string
  contentJson: object
  contentHtml: string
}

export const CreateNews = new ObjectSchemaRequired(
  'CreateNews',
  {
    slug,
    title,
    description,
    contentJson,
    contentHtml,
  }
)

export interface NewsQuery {
  page: number
  limit: number
}

export const NewsQuery = new ObjectSchema(
  'NewsQuery',
  {
    page: new QueryPageNumber().setDefault(1),
    limit: new QueryPageLimit().setDefault(10)
  }
)

export interface UpdateNews {
  slug?: string
  title?: string
  description?: string
  contentJson?: object
  contentHtml?: string
}

export const UpdateNews = new ObjectSchema(
  'UpdateNews',
  {
    slug,
    title,
    description,
    contentJson,
    contentHtml,
  }
)
