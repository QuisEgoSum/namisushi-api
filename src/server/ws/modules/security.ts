import {logger as defaultLogger} from '@logger'
import {BaseError} from 'openapi-error'
import type {User, UserSession} from '@app/user'
import type {Server, Socket} from 'socket.io'


declare module 'socket.io' {
  interface Socket {
    session: UserSession
  }
}


const logger = defaultLogger.child({label: 'websocket'})


function extractSessionId(socket: Socket) {
  const cookie = socket.handshake.headers['cookie']
  if (!cookie) {
    return
  }
  const sessionCookie = cookie.split(';').find(s => s.startsWith('sessionId='))
  if (!sessionCookie) {
    return
  }
  return sessionCookie.replace('sessionId=', '')
}

export function security(server: Server, user: User) {
  server.on('connection', async socket => {
    try {
      socket.session = await user.service.authorization(extractSessionId(socket))
      socket.emit('authorization:ok')
      socket.join(socket.session.userRole)
      socket.join(socket.session.userId.toHexString())
    } catch(error) {
      if (error instanceof BaseError) {
        logger.debug(error)
        socket.emit('authorization:error', error)
      } else {
        logger.error(error)
      }
      socket.disconnect()
    }
  })
}