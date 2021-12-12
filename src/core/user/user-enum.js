

/**
 * @typedef USER_ENUM
 * @type {Object}
 * @property {Readonly<USER_ROLE>} USER_ROLE
 */



/**
 * @typedef {'User'|'Admin'} USER_ROLE_VALUE
 */
class USER_ROLE {
    constructor() {

        /**
         * @type {'User'}
         */
        this.USER = 'User'

        /**
         * @type {'Admin'}
         */
        this.ADMIN = 'Admin'
    }

    /**
     * @returns {['User', 'Admin']}
     */
    values() {
        return ['User', 'Admin']
    }
}


/**
 * @type {USER_ENUM}
 */
module.exports = {
    USER_ROLE: Object.freeze(new USER_ROLE())
}