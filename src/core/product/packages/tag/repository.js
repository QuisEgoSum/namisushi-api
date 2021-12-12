const Tag = require('./Tag')
const {ObjectId} = require('mongoose').Types


/** 
 * @returns {Promise.<import('./Tag').Tag[]>} 
 */
const findTags = () => Tag
    .find({})
    .lean()

/**
 * @param {ObjectId|String} tagId 
 * @returns {Promise.<import('./Tag').Tag>}
 */
const findTag = tagId => Tag
    .findById(ObjectId(tagId))
    .lean()

/** 
 * @param {{title: String, icon: String}} tag 
 * @returns {Promise.<import('./Tag').Tag>}
 */
const saveTag = tag => new Tag(tag)
    .save()
    .then(tag => tag.toJSON())

/** 
 * @param {ObjectId} tagId 
 * @param {{title: String, icon: String}} update 
 * @returns {Promise.<import('./Tag').Tag>} 
 */
const updateTag = (tagId, update) => Tag
    .findByIdAndUpdate(tagId, update)
    .lean()

/** 
 * @param {ObjectId|String} tagId
 * @returns {Promise.<null|{icon: String}>}
 */
const deleteTag = tagId => Tag
    .findByIdAndDelete(ObjectId(tagId))
    .select({icon: 1})
    .lean()


module.exports = {
    saveTag,
    updateTag,
    deleteTag,
    findTag,
    findTags
}