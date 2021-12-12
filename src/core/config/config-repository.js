const Config = require('./ConfigModel')
const configCache = require('./config-cache')
const pkgJson = require('../../../package.json')


const assuredEmptyConfig = () => Config
    .updateOne(
        {},
        {
            $set: {
                version: pkgJson.version
            },
            $setOnInsert: {
                telegram: {
                    adminIds: [],
                    superadminIds: []
                }
            }
        },
        {
            upsert: true
        }
    )

const getConfig = () => Config
    .findOne()
    .lean()

const getTelegramAdminIds = () => configCache
    .getTelegramAdminIds()

const getTelegramSuperadminIds = () => configCache
    .getTelegramSuperadminIds()


module.exports = {
    assuredEmptyConfig,
    getConfig,
    getTelegramAdminIds,
    getTelegramSuperadminIds
}