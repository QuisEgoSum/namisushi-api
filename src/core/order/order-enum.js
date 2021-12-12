

/**
 * @typedef {0|10|20|30|40} ORDER_CONDITION_VALUE
 */
class CONDITION {

    constructor() {
        /**
         * @type {0}
         */
        this[0] = 0
        /**
         * @type {10}
         */
        this[10] = 10
        /**
         * @type {20}
         */
        this[20] = 20
        /**
         * @type {30}
         */
        this[30] = 30
        /**
         * @type {40}
         */
        this[40] = 40
    }

    /**
     * @returns {[0, 10, 20, 30, 40]}
     */
    values() {
        return [0, 10, 20, 30, 40]
    }
}

/**
 * @typedef {'NEW_ORDER'} ORDER_EVENTS
 */
class EVENTS {
    constructor() {
        /**
         * @type {'NEW_ORDER'}
         */
        this.NEW_ORDER = 'NEW_ORDER'
    }

    /**
     * @return {['NEW_ORDER']}
     */
    values() {
        return ['NEW_ORDER']
    }
}

/**
 * @typedef {'WITHOUT_DELIVERY'|'WEEKDAY'} ORDER_DISCOUNT_VALUE
 */
class ORDER_DISCOUNT {
    constructor() {
        /**
         * @type {'WITHOUT_DELIVERY'}
         */
        this.WITHOUT_DELIVERY = 'WITHOUT_DELIVERY'
        /**
         * @type {'WEEKDAY'}
         */
        this.WEEKDAY = 'WEEKDAY'
    }

    values() {
        return ['WITHOUT_DELIVERY', 'WEEKDAY']
    }
}


module.exports = {
    CONDITION: new CONDITION(),
    EVENTS: new EVENTS(),
    ORDER_DISCOUNT: new ORDER_DISCOUNT()
}