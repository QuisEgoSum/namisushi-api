import {NotificationMessageUtils} from '@app/notification/NotificationMessageUtils'
import {NotificationWebSocketAgent, NotificationWebSocketEvents} from '@app/notification/NotificationWebSocketAgent'
import {UserRole} from '@app/user'
import {emitter as loggerEmitter, logger} from '@logger'
import type {NotificationTelegramAgent} from '@app/notification/NotificationTelegramAgent'
import type {PopulatedOrder} from '@app/order/schemas/entities'
import {ExtraReplyMessage} from 'telegraf/typings/telegram-types'
import {OrderCondition} from '@app/order'


export class NotificationService {

  static errorHandler(error: Error): void {
    logger.error(error)
  }

  constructor(
    private readonly telegram: NotificationTelegramAgent,
    private readonly ws: NotificationWebSocketAgent
  ) {
    loggerEmitter
      .on(
        'ERROR',
        (level, log) => this
          .errorHandler(level, log)
      )
  }

  public async startApplication() {
    try {
      await this.telegram.sendWatcherMessage(NotificationMessageUtils.getStartMessage())
    } catch (error) {
      logger.error(error)
    }
  }

  async shutdownApplication(event: string) {
    try {
      await this.telegram.sendWatcherMessage(NotificationMessageUtils.getShutdownMessage(event))
      await this.telegram.sendWatcherMessage(NotificationMessageUtils.getShutdownMessage(event))
    } catch (error) {
      logger.error(error)
    }
  }

  async newOrder(order: PopulatedOrder, message: string[], options: ExtraReplyMessage) {
    this.ws.sendEvent(
      NotificationWebSocketEvents.NEW_ORDER,
      String(order.clientId),
      {_id: order.clientId, condition: order.condition}
    )
    this.ws.sendEvent(NotificationWebSocketEvents.NEW_ORDER, UserRole.ADMIN, order)
    this.ws.sendEvent(NotificationWebSocketEvents.NEW_ORDER, UserRole.WATCHER, order)
    return await this.telegram.sendAdminMessage(
      message,
      options
    )
  }

  private async errorHandler(level: 'FATAL' | 'ERROR', log: string): Promise<void> {
    try {
      await this.telegram.sendWatcherMessage(NotificationMessageUtils.parseLog(level, log))
    } catch (error) {
      logger.fatalOnlyStdout(error)
    }
  }

  async updateStatus(clientId: string, orderId: string, condition: OrderCondition) {
    this.ws.sendEvent(NotificationWebSocketEvents.ORDER_CONDITION, clientId, {_id: orderId, condition: condition})
  }
}