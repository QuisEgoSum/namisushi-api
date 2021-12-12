const path = require('path')


/**
 * @extends ApplicationConfig
 */
class ConfigEntity {
    /**
     * @param {ApplicationConfig} [defaultConfig]
     */
    constructor(defaultConfig = {}) {
        Object.assign(this, defaultConfig)

        this.path = {
            root: path.resolve(__dirname, '../../../'),
            src: path.resolve(__dirname, '../../../src'),
            core: path.resolve(__dirname, '../../../core'),
            docs: path.resolve(__dirname, '../../../docs'),
            logs: path.resolve(__dirname, '../../../logs'),
            image: path.resolve(__dirname, '../../../image'),
            userAvatar: path.resolve(__dirname, '../../../image/user/avatar'),
            productImage: path.resolve(__dirname, '../../../image/product')
        }
    }
}


module.exports = ConfigEntity