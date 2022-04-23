import {io} from 'socket.io-client'


async function main() {
  const socket = io('http://localhost:8000', {
    path: '/ws',
    extraHeaders: {
      'Cookie': 'sessionId=7e431eb9-2573-4f79-b25b-f8ceb24196e2'
    },
    transports: ['websocket']
  })

  socket.on('connect_error', e => console.error('connect_error', e))
  socket.on('connect', () => console.log('connect'))
  socket.on('authorization:error', console.log)
  socket.on('authorization:ok', () => console.log('authorization:ok'))
  socket.on('disconnect', () => console.log('disconnect'))
  socket.on('order:new', o => console.dir(o, {depth: 10}))

  socket.connect()
}

main()
  .catch(error => {
    console.error(error)
    process.exit(0)
  })