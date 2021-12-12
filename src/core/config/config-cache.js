

class ConfigCache {
    constructor() {
        /**
         * @private
         */
        this.telegram = {
            adminIds: new Set(),
            superadminIds: new Set()
        }
    }

    reload(config) {
        if ('telegram' in config) {
            if ('adminIds' in config.telegram) {
                this.telegram.adminIds = new Set(config.telegram.adminIds)
            }
            if ('superadminIds' in config.telegram) {
                this.telegram.superadminIds = new Set(config.telegram.superadminIds)
            }
        }
    }

    /**
     * @returns {Array<Number>}
     */
    getTelegramAdminIds() {
        return Array.from(this.telegram.adminIds)
    }

    /**
     * @returns {Array<Number>}
     */
    getTelegramSuperadminIds() {
        return Array.from(this.telegram.superadminIds)
    }

    pushTelegramAdminId(adminId) {
        this.telegram.adminIds.add(adminId)
    }

    pullTelegramAdminId(adminId) {
        return this.telegram.adminIds.delete(adminId)
    }

    pushTelegramSuperadminId(adminId) {
        this.telegram.superadminIds.add(adminId)
    }

    pullTelegramSuperadminId(superadminId) {
        return this.telegram.superadminIds.delete(superadminId)
    }
}


module.exports = new ConfigCache()