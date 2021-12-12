const service = require('./service')
const schemes = require('./schemes')
const validationCompile = require('../../../../utils/validation')
const {deleteFile} = require('../../../../utils/fs')


const validationCreateTag = validationCompile(schemes.createTagBody)
const validationUpdateTag = validationCompile(schemes.updateTagBody)


/**
 * @param {import('fastify').FastifyRequest} req 
 * @param {import('fastify').FastifyReply} res 
 */
module.exports.getTags = async function(req, res) {
    const tag = await service.findTags()

    res.status(200).type('application/json').send(tag)
}

/**
 * @param {import('fastify').FastifyRequest & {
 *      body: {data: import('./json-schemas/tag-create.body').CreateTagBodyJSON},
 *      file: import('./upload').TagIconFile
 *          }} req 
 * @param {import('fastify').FastifyReply} res 
 */
module.exports.createTag = async function(req, res) {
    try {
        req.body = validationCompile.normalizeBody(req.body)

        validationCreateTag(req.body.data)

        const tag = await service.createTag(req.body.data, req.file)

        res.status(201).type('application/json').send(tag)
    } catch(error) {
        if (req.file)
            deleteFile(req.file.path)
        throw error
    }
}

/**
 * @param {import('fastify').FastifyRequest & {
 *      body: {data: import('./json-schemas/tag-update.body').UpdateTagBodyJSON},
 *      file: import('./upload').TagIconFile
 *          }} req 
 * @param {import('fastify').FastifyReply} res 
 */
module.exports.updateTag = async function(req, res) {
    try {
        req.body = validationCompile.normalizeBody(req.body)

        validationUpdateTag(req.body.data)

        const tag = await service.updateTag(req.params.tagId, req.body.data, req.file)

        res.status(200).type('application/json').send(tag)
    } catch(error) {
        if (req.file)
            deleteFile(req.file.path)
        throw error
    }
}

/**
 * @param {import('fastify').FastifyRequest & {params: {tagId: String}}} req 
 * @param {import('fastify').FastifyReply} res 
 */
module.exports.deleteTag = async function(req, res) {
    await service.deleteTag(req.params.tagId)

    res.status(200).type('application/json').send({message: 'Тег удалён'})
}