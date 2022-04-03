import {INotificationEventEmitter} from '@app/notification/NotificationEventEmitter'
import {NotificationEvents} from '@app/notification/NotificationEvents'
import {PopulatedOrder} from '@app/order/schemas/entities'
import {NotificationTelegramAgent} from '@app/notification/NotificationTelegramAgent'
import {emitter as loggerEmitter, logger} from '@logger'
import {NotificationMessageUtils} from '@app/notification/NotificationMessageUtils'


export class NotificationEventListener {

  static errorHandler(error: Error): void {
    logger.fatal(error)
  }

  constructor(
    private readonly emitter: INotificationEventEmitter,
    private readonly telegram: NotificationTelegramAgent | null
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

  public async startApplication() {
    try {
      if (this.telegram) {
        await this.telegram.sendWatcherMessage(
          NotificationMessageUtils.telegramMessageReplacer(NotificationMessageUtils.getStartMessage())
        )
      }
    } catch (error) {
      logger.fatal(error)
    }
  }

  async shutdownApplication(event: string) {
    try {
      if (this.telegram) {
        await this.telegram.sendWatcherMessage(
          NotificationMessageUtils.telegramMessageReplacer(NotificationMessageUtils.getShutdownMessage(event))
        )
      }
    } catch (error) {
      logger.fatal(error)
    }
  }

  private async newOrderHandler(order: PopulatedOrder): Promise<void> {
    if (this.telegram) {
      await this.telegram.sendAdminMessage(
        NotificationMessageUtils.telegramMessageReplacer(NotificationMessageUtils.parseOrder(order))
      )
    }
  }

  private async errorHandler(level: 'FATAL' | 'ERROR', log: string): Promise<void> {
    try {
      if (this.telegram) {
        await this.telegram.sendWatcherMessage(
          NotificationMessageUtils.telegramMessageReplacer(NotificationMessageUtils.parseLog(level, log), '\n')
        )
      }
    } catch (error) {
      logger.fatalOnlyStdout(error)
    }
  }
}