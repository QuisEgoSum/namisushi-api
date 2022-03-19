import {BaseService} from '@core/service'
import type {ICounter} from '@app/order/packages/counter/CounterModel'
import type {CounterRepository} from '@app/order/packages/counter/CounterRepository'


export class CounterService extends BaseService<ICounter, CounterRepository> {
  async upsert() {
    await this.repository.upsert()
  }

  async inc() {
    return await this.repository.inc()
  }
}