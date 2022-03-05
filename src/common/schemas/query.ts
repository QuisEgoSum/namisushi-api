import type {SortDirection} from 'mongodb'


class Query<T> {
  title?: string
  type?: string | string[]
  description?: string
  default?: T

  setDefault(value: T) {
    this.default = value
    return this
  }
}

export class QuerySortDirection extends Query<SortDirection> {
  private enum: (number | string)[]
  private transform: string[]
  constructor() {
    super()
    this.title = 'SortDirection'
    this.description = 'Sort direction. In any case'
    this.type = ['string']
    this.enum = ['asc', 'desc', 'ascending', 'descending']
    this.transform = ['toLowerCase']
  }
}

export class QueryPageLimit extends Query<number> {
  private minimum: number
  private maximum: number
  constructor() {
    super()
    this.type = 'integer'
    this.minimum = 1
    this.maximum = 1000
  }
}

export class QueryPageNumber extends Query<number> {
  private minimum: number
  private maximum: number
  constructor() {
    super()
    this.type = 'integer'
    this.minimum = 1
    this.maximum = 1000
  }
}
