import {NotificationMessageUtils} from '@app/notification/NotificationMessageUtils'
import {NotificationWebSocketAgent, NotificationWebSocketEvents} from '@app/notification/NotificationWebSocketAgent'
import {NotificationEvents} from '@app/notification/NotificationEvents'
import {UserRole} from '@app/user'
import {emitter as loggerEmitter, logger} from '@logger'
import type {INotificationEventEmitter} from '@app/notification/NotificationEventEmitter'
import type {NotificationTelegramAgent} from '@app/notification/NotificationTelegramAgent'
import type {PopulatedOrder} from '@app/order/schemas/entities'


export class NotificationEventListener {

  static errorHandler(error: Error): void {
    logger.error(error)
  }

  constructor(
    private readonly emitter: INotificationEventEmitter,
    private readonly telegram: NotificationTelegramAgent | null,
    protected readonly ws: NotificationWebSocketAgent
  ) {
    this.emitter
      .on(
        NotificationEvents.NEW_ORDER,
        (order) => this.newOrderHandler(order).catch(NotificationEventListener.errorHandler)
      )
    loggerEmitter
      .on(
        'ERROR',
        (level, log) => this
          .errorHandler(level, log)
      )
  }

  private async makeTelegramAction<T>(cb: (telegram: NotificationTelegramAgent) => T): Promise<T | null> {
    if (this.telegram) {
      return cb(this.telegram)
    } else {
      return null
    }
  }

  public async startApplication() {
    try {
      if (this.telegram) {
        await this.telegram.sendWatcherMessage(
          NotificationMessageUtils.telegramMessageReplacer(NotificationMessageUtils.getStartMessage())
        )
      }
    } catch (error) {
      logger.error(error)
    }
  }

  async shutdownApplication(event: string) {
    try {
      await this.makeTelegramAction(telegram => telegram.sendWatcherMessage(
        NotificationMessageUtils.telegramMessageReplacer(NotificationMessageUtils.getShutdownMessage(event))
      ))
    } catch (error) {
      logger.error(error)
    }
  }

  private async newOrderHandler(order: PopulatedOrder): Promise<void> {
    this.ws.sendEvent(NotificationWebSocketEvents.NEW_ORDER, UserRole.ADMIN, order)
    this.ws.sendEvent(NotificationWebSocketEvents.NEW_ORDER, UserRole.WATCHER, order)
    await this.makeTelegramAction(telegram => telegram.sendAdminMessage(
      NotificationMessageUtils.telegramMessageReplacer(NotificationMessageUtils.parseOrder(order))
    ))
  }

  private async errorHandler(level: 'FATAL' | 'ERROR', log: string): Promise<void> {
    try {
      await this.makeTelegramAction(telegram => telegram.sendWatcherMessage(
        NotificationMessageUtils.telegramMessageReplacer(NotificationMessageUtils.parseLog(level, log), '\n')
      ))
    } catch (error) {
      logger.fatalOnlyStdout(error)
    }
  }
}