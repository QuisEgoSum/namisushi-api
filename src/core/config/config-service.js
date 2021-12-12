const configRepository = require('./config-repository')
const configCache = require('./config-cache')


async function init() {
    await configRepository.assuredEmptyConfig()

    const adminConfig = await configRepository.getConfig()

    configCache.reload(adminConfig)
}


function getTelegramAdminIds() {
    return configRepository.getTelegramAdminIds()
}

function getTelegramSuperadminIds() {
    return configRepository.getTelegramSuperadminIds()
}


module.exports = {
    init,
    getTelegramAdminIds,
    getTelegramSuperadminIds
}