import {NotificationEventEmitter, INotificationEventEmitter} from '@app/notification/NotificationEventEmitter'
import {NotificationEventListener} from '@app/notification/NotificationEventListener'
import {NotificationTelegramAgent} from '@app/notification/NotificationTelegramAgent'
import {NotificationWebSocketAgent} from '@app/notification/NotificationWebSocketAgent'
import {NotificationEvents} from '@app/notification/NotificationEvents'
import {User} from '@app/user'
import type {TelegramBot} from '../../servers/telegram'
import type {Server} from 'socket.io'


class Notification {
  constructor(
    public readonly emitter: INotificationEventEmitter,
    public readonly listener: NotificationEventListener
  ) {}
}


export async function initNotification(
  bot: TelegramBot,
  ws: Server,
  user: User
): Promise<Notification> {
  let telegram: NotificationTelegramAgent | null = null
  if (bot) {
    telegram = new NotificationTelegramAgent(bot, user.service)
  }
  const webSocketAgent = new NotificationWebSocketAgent(ws)
  const emitter = new NotificationEventEmitter()
  const listener = new NotificationEventListener(emitter, telegram, webSocketAgent)
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