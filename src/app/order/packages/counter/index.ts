import {CounterModel} from '@app/order/packages/counter/CounterModel'
import {CounterRepository} from '@app/order/packages/counter/CounterRepository'
import {CounterService} from '@app/order/packages/counter/CounterService'


class Counter {
  public readonly service: CounterService
  constructor(
    service: CounterService
  ) {
    this.service = service
  }
}

export async function initCounter() {
  const service = new CounterService(new CounterRepository(CounterModel))
  await service.upsert()
  return new Counter(service)
}

export type {
  Counter
}