const tagRepository = require('./repository')
const productService = require('../../index')
const {deleteFileFromRootDir} = require('../../../../utils/fs')
const {NotFound} = require('../../../../utils/error-types')


function findTags() {
    return tagRepository.findTags()
}

/**
 * @param {{title: String}} data 
 * @param {{filename: String}} icon 
 */
async function createTag(data, icon) {
    if (icon)
        data.icon = `/image/tag/${icon.filename}`

    return tagRepository.saveTag(data)
}

/**
 * @param {String} tagId 
 * @param {{title: String}} data 
 * @param {{filename: String}|undefined} icon 
 * @throws {NotFound}
 */
async function updateTag(tagId, tag, icon) {
    if (icon)
        tag.icon = `/image/tag/${icon.filename}`

    tag = await tagRepository.updateTag(tagId, tag)

    if (!tag)
        throw new NotFound('Тег не найден')

    if (icon && tag.icon)
        deleteFileFromRootDir('/image/tag/' + tag.icon.split('/').pop())

    return await tagRepository.findTag(tagId)
}

/**
 * @param {String} tagId 
 * @returns {Promise.<undefined>}
 * @throws {NotFound}
 */
async function deleteTag(tagId) {
    const tag = await tagRepository.deleteTag(tagId)

    if (!tag)
        throw new NotFound('Тег не найден')

    await productService.pullTag(tagId)

    if (tag.icon)
        deleteFileFromRootDir('/image/tag/' + tag.icon.split('/').pop())
}


module.exports = {
    findTags,
    createTag,
    updateTag,
    deleteTag
}