

export class DataList<T> {
  constructor(
    public readonly total: number,
    public readonly pages: number,
    public readonly data: Array<T>
  ) {}
}