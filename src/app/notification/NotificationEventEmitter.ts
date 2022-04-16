import {NotificationEvents} from '@app/notification/NotificationEvents'
import {PopulatedOrder} from '@app/order/schemas/entities'
import {EventEmitter} from 'events'


export interface INotificationEventEmitter {
  emit(event: NotificationEvents.NEW_ORDER, order: PopulatedOrder): boolean
  on(eventName: NotificationEvents.NEW_ORDER, listener: (order: PopulatedOrder) => Promise<void>): this
}


export class NotificationEventEmitter extends EventEmitter implements INotificationEventEmitter {}