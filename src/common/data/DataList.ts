

export class DataList<T> {

  total: number
  pages: number
  data: Array<T>

  constructor(total: number, pages: number, data: Array<T>) {
    this.total = total
    this.pages = pages
    this.data = data
  }
}