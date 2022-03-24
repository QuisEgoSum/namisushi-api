import {INotificationEventEmitter} from '@app/notification/NotificationEventEmitter'
import {NotificationEvents} from '@app/notification/NotificationEvents'
import {PopulatedOrder} from '@app/order/schemas/entities'
import {NotificationTelegramAgent} from '@app/notification/NotificationTelegramAgent'


export class NotificationEventListener {
  constructor(
    private readonly emitter: INotificationEventEmitter,
    private readonly telegram: NotificationTelegramAgent | null
  ) {
    this.emitter
      .on(NotificationEvents.NEW_ORDER, this.newOrderHandler.bind(this))
  }

  private async newOrderHandler(order: PopulatedOrder): Promise<void> {
    if (this.telegram) {
      await this.telegram.newOrderHandler(order)
    }
  }
}