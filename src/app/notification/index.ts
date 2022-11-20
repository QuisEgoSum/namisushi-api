import {NotificationService} from '@app/notification/NotificationService'
import {NotificationTelegramAgent} from '@app/notification/NotificationTelegramAgent'
import {NotificationWebSocketAgent} from '@app/notification/NotificationWebSocketAgent'
import {User} from '@app/user'
import type {Server} from 'socket.io'
import {Telegram} from '../../server/telegram/Telegram'


class Notification {
  constructor(
    public readonly service: NotificationService
  ) {}
}


export async function initNotification(
  bot: Telegram,
  ws: Server,
  user: User
): Promise<Notification> {
  const telegram = new NotificationTelegramAgent(bot, user.service)
  const webSocketAgent = new NotificationWebSocketAgent(ws)
  const service = new NotificationService(telegram, webSocketAgent)
  return new Notification(service)
}


export type {
  Notification,
  NotificationService
}