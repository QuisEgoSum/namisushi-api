import {BaseRepository} from '@core/repository'
import {ICategory} from '@app/product/packages/category/CategoryModel'
import {DataList} from '@common/data'


export class CategoryRepository extends BaseRepository<ICategory> {

  async findAll() {
    const [data, total] = await Promise.all([
      this.find({}),
      this.count({})
    ])

    return new DataList(total, 1, data)
  }
}