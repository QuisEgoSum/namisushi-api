

/**
 * @param {import('socket.io').Socket} socket 
 */
function connectCommon(socket) {
    socket.join(String(socket.user.userId))
    socket.join(socket.user.role)
    socket.on('subscribe-order', (orderId) => socket.join('order-' + orderId))
    socket.emit('connection')
}

/**
 * @param {import('socket.io').Socket} socket 
 */
function connectUser(socket) {
    connectCommon(socket)
}

/**
 * @param {import('socket.io').Socket} socket 
 */
function connectAdmin(socket) {
    connectCommon(socket)
    socket.on('subscribe-admin', msg => {
        if (msg === 'new-orders') {
            socket.join(msg)
            socket.emit('debug', `subscribe ${msg}`)
        }
    })
    socket.on('unsubscribe-admin', msg => {
        if (msg === 'new-orders') {
            socket.leave(msg)
            socket.emit('debug', `unsubscribe ${msg}`)
        }
    })
}


module.exports = {connectUser, connectAdmin}