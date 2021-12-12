const Category = require('./CategoryModel')
const {ObjectId} = require('mongoose').Types
const errorUtil = require('utils/error')
const categoryError = require('./category-error')


/**
 * @returns {Promise.<CategoryBase[]>}
 */
const findCategories = () => Category
    .find({})
    .lean()

/**
 * @param {CreateCategory} category
 * @returns {Promise.<CategoryBase>}
 */
const saveCategory = category => new Category(category)
    .save()
    .then(category => category.toJSON())
    .catch(error => {
        if (errorUtil.isUniqueMongoError(error)) {
            throw new categoryError.CategoryExistsError()
        } else {
            throw error
        }
    })

/**
 * @param {ObjectId|String} categoryId 
 * @param {UpdateCategory} category
 * @returns {Promise.<CategoryBase>}
 */
const updateCategory = (categoryId, category) => Category
    .findByIdAndUpdate(ObjectId(categoryId), category, {new: true})
    .lean()

/**
 * @param {String} categoryId
 * @returns {Promise.<CategoryBase>}
 */
const deleteCategory = categoryId => Category
    .findByIdAndDelete(ObjectId(categoryId))
    .lean()


module.exports = {
    saveCategory,
    updateCategory,
    deleteCategory,
    findCategories
}