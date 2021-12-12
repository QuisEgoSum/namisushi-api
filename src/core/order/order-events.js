const events = require('events')
const ORDER_ENUM = require('./order-enum')


class OrderEvents extends events.EventEmitter {
    constructor() {
        super()
    }

    newOrder(order) {
        this.emit(ORDER_ENUM.EVENTS.NEW_ORDER, order)
    }

    onNewOrder(handler) {
        this.on(ORDER_ENUM.EVENTS.NEW_ORDER, handler)
    }
}


module.exports = new OrderEvents()