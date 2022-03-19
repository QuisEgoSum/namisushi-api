import {BaseRepository} from '@core/repository'
import type {ICounter} from '@app/order/packages/counter/CounterModel'


export class CounterRepository extends BaseRepository<ICounter> {
  async upsert() {
    await this.Model.updateOne({}, {$setOnInsert: {number: 0}})
  }

  async inc(): Promise<number> {
    return await this.Model.findOneAndUpdate({}, {$inc: {number: 1}}, {upsert: true, new: true})
      .then(doc => doc.number)
  }
}