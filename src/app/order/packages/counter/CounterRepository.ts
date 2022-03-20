import {BaseRepository} from '@core/repository'
import type {ICounter} from '@app/order/packages/counter/CounterModel'


export class CounterRepository extends BaseRepository<ICounter> {
  async upsert(isTest: boolean) {
    await this.Model.updateOne({isTest}, {$setOnInsert: {number: 0}})
  }

  async inc(isTest: boolean): Promise<number> {
    return await this.Model.findOneAndUpdate({isTest}, {$inc: {number: 1}}, {upsert: true, new: true})
      .then(doc => doc.number)
  }
}