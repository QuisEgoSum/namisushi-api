const categoryRepository = require('./category-repository')
const categoryEvents = require('./category-events')
const categoryError = require('./category-error')


async function findCategories() {
    return categoryRepository.findCategories()
}

async function createCategory(data) {
    return await categoryRepository.saveCategory(data)
}

async function updateCategory(categoryId, category) {
    const updateCategory = await categoryRepository.updateCategory(categoryId, category)

    if (!updateCategory) {
        throw new categoryError.CategoryNotExistsError()
    }

    return updateCategory
}

async function deleteCategory(categoryId) {
    const category = await categoryRepository.deleteCategory(categoryId)

    if (!category) {
        throw new categoryError.CategoryNotExistsError()
    }

    categoryEvents.deleteCategory(category)
}


module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    findCategories
}