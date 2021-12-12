const service = require('./category-service')


module.exports.getCategories = async function(req, res) {
    const categories = await service.findCategories()

    res
        .status(200)
        .type('application/json')
        .send(
            {
                categories: categories
            }
        )
}

module.exports.createCategory = async function(req, res) {
    const category = await service.createCategory(req.body)

    res.status(201).type('application/json').send(
        {
            category: category
        }
    )
}

module.exports.updateCategory = async function(req, res) {
    const category = await service.updateCategory(req.params.categoryId, req.body)

    res
        .status(200)
        .type('application/json')
        .send(
            {
                category: category
            }
        )
}

module.exports.deleteCategory = async function(req, res) {
    await service.deleteCategory(req.params.categoryId)

    res
        .status(200)
        .type('application/json')
        .send(
            {
                message: 'Категория удалена'
            }
        )
}