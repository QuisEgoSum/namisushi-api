

/**
 * @typedef {'ASC'|'DESC'} SORT_VALUE
 */
class SORT {
    constructor() {
        /**
         * @type {'ASC'}
         */
        this.ASC = 'ASC'

        /**
         * @type {'DESC'}
         */
        this.DESC = 'DESC'
    }

    values() {
        return Object.values(this)
    }
}


module.exports = {
    SORT: new SORT()
}

