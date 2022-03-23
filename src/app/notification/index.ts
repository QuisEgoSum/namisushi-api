import type {Telegraf} from 'telegraf'
import {NotificationEventEmitter, INotificationEventEmitter} from '@app/notification/NotificationEventEmitter'
import {NotificationEventListener} from './NotificationEventListener'
import {NotificationTelegramAgent} from './NotificationTelegramAgent'
import {NotificationEvents} from './NotificationEvents'
import {User} from '../user'


class Notification {
  constructor(
    public readonly emitter: INotificationEventEmitter,
    public readonly listener: NotificationEventListener
  ) {}
}

export async function initNotification(
  bot: Telegraf,
  user: User
): Promise<Notification> {
  const telegram = new NotificationTelegramAgent(bot, user.service)
  const emitter = new NotificationEventEmitter()
  const listener = new NotificationEventListener(emitter, telegram)
  return new Notification(emitter, listener)
}

export {
  NotificationEvents
}

export type {
  Notification,
  INotificationEventEmitter,
  NotificationEventListener
}