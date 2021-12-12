const events = require('events')
const logger = require('@logger')


class CategoryEvents extends events.EventEmitter {
    constructor() {
        super()
    }

    /**
     * @param {CategoryBase} category
     */
    deleteCategory(category) {
        this.emit('delete-category', category)
    }

    /**
     * @callback DeleteCategoryExecutor
     * @param {CategoryBase} category
     * @returns {Promise.<any>}
     */

    /**
     * @param {DeleteCategoryExecutor} executor
     */
    onDeleteCategory(executor) {
        this.on('delete-category', async (category) => {
            try {
                await executor(category)
            } catch (error) {
                logger.error(error)
            }
        })
    }
}


module.exports = new CategoryEvents()