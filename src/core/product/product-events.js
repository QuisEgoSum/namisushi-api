const events = require('events')
const categoryEvents = require('./packages/category').events
const productService = require('./product-service')


class ProductEvents extends events.EventEmitter {
    constructor() {
        super()

        categoryEvents
            .onDeleteCategory(this.deleteCategoryHandler.bind(this))
    }

    /**
     * @async
     * @param {CategoryBase} category
     * @returns {Promise<any>}
     */
    async deleteCategoryHandler(category) {
        await productService.pullCategory(category._id)
    }
}


module.exports = new ProductEvents()