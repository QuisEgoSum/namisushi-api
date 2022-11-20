import {Server} from 'socket.io'
import {config} from '@config'
import {security} from './modules/security'
import type {User} from '@app/user'


export function createWsServer(user: User): Server {
  const server = new Server(
    {
      path: '/ws',
      cors: {
        optionsSuccessStatus: 204,
        credentials: true,
        allowedHeaders: config.server.cors.allowedHeaders,
        origin: config.server.cors.allowedOrigins
      },
      transports: ['websocket']
    }
  )
  security(server, user)
  return server
}