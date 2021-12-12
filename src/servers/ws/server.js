const http = require('http')
const socketIo = require('socket.io')
const security = require('../../helpers/security')
const connect = require('./connect')
const orderEvents = require('core/order').events
const {errorHandler} = require('./error/handler')
const config = require('../../config')


/**
 * @returns {Server}
 */
function createWsServer() {
    const server = http.createServer()

    const io = socketIo(server, {
        path: '/ws',
        cors: {
            origin: config.server.allowedOrigins,
            methods: ['GET', 'POST'],
            allowedHeaders: config.server.allowedHeaders,
            credentials: true
        }
    })

    io.on('connection', /** @param {socketIo.Socket & {user: UserSession}} socket */ async function(socket) {
        try {
            socket.user = await security.authorizationByCookieString(socket.handshake.headers.cookie)

            if (socket.user.isAdmin()) {
                connect.connectAdmin(socket)
            } else {
                connect.connectUser(socket)
            }

        } catch(error) {
            errorHandler(error, socket)
            socket.disconnect()
        }
    })

    orderEvents.onNewOrder((order) => io.to('new-orders').emit('new-order', {order}))

    return server
}


module.exports = createWsServer