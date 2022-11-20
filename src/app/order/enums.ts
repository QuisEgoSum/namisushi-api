

export enum OrderCondition {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_THE_WAY = 'IN_THE_WAY',
  IS_DELIVERED = 'IS_DELIVERED',
  DONE = 'DONE',
  REJECT = 'REJECT',
  CANCELLED = 'CANCELLED',
  COLLECTED = 'COLLECTED'
}


export enum OrderDiscount {
  WITHOUT_DELIVERY = 'WITHOUT_DELIVERY',
  WEEKDAY = 'WEEKDAY'
}

export enum OrderTelegramEvent {
  IN_PROGRESS = 'otip',
  REJECT = 'otr',
  IN_THE_WAY = 'otd',
  IS_DELIVERED = 'otdd',
  DONE = 'otdo',
  COLLECTED = 'otc'
}