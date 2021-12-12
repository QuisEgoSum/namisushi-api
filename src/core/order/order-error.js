const ApplicationError = require('libs/error')


class LargeOrderTimeIntervalError extends ApplicationError.InvalidDataError {
    constructor() {
        super(
            {
                message: 'Промежуток времени для отложенного заказа не может быть меньше часа',
                code: 3001
            }
        )
    }
}

class PhoneNumberMissingError extends ApplicationError.InvalidDataError {
    constructor() {
        super(
            {
                message: 'Укажите номер телефона',
                code: 3002
            }
        )
    }
}

class OrderProductDoesNotExistError extends ApplicationError.EntityNotExistsError {
    /**
     * @param {Object} [error]
     * @param {Array.<String>} [error.productIds] |ObjectId
     */
    constructor(error) {
        super(
            {
                message: 'Продукт не найден',
                code: 3003
            }
        )

        this.productIds = error?.productIds?.map(String) || []
    }

    toJSON() {
        const error = super.toJSON()

        error.productIds = [...this.productIds]

        return error
    }
}

class OrderNotExistsError extends ApplicationError.EntityNotExistsError {
    /**
     * @param {String} orderId |ObjectId
     */
    constructor(orderId) {
        super(
            {
                message: 'Заказ не найден',
                code: 3004
            }
        )

        this.orderId = String(orderId)
    }

    toJSON() {
        const error = super.toJSON()

        error.orderId = this.orderId

        return error
    }
}

class OrderCannotBeCanceledError extends ApplicationError.AccessError {
    constructor() {
        super(
            {
                message: 'Вы не можете отменить этот заказ',
                code: 3005
            }
        )
    }
}


module.exports = {
    LargeOrderTimeIntervalError,
    PhoneNumberMissingError,
    OrderProductDoesNotExistError,
    OrderNotExistsError,
    OrderCannotBeCanceledError
}