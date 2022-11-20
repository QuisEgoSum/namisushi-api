import type {Server} from 'socket.io'
import {UserRole} from '@app/user'


export enum NotificationWebSocketEvents {
  NEW_ORDER = 'order:new',
  ORDER_CONDITION = 'order:condition'
}


export class NotificationWebSocketAgent {
  constructor(
    private readonly ws: Server
  ) {}

  sendEvent(event: NotificationWebSocketEvents, room: string | UserRole, data: unknown) {
    return this.ws.to(room).emit(event, data)
  }
}