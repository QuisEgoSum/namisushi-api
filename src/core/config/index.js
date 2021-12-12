const ConfigEntity = require('./ConfigEntity')
const YAML = require('yaml')
const alg = require('libs/alg')
const fs = require('fs')
const path = require('path')


const defaultConfigPath = path.resolve(__dirname, '../../../config/default.yaml')
const configPath = process
    .argv
    .find(
        arg => arg
            .startsWith('--config=')
    )?.replace('--config=', '')

function loadDefaultConfig() {
    const defaultConfigSource = fs.readFileSync(defaultConfigPath, {encoding: 'utf-8'})

    if (configPath) {
        if (fs.existsSync(configPath)) {
            console.log(`Used config ${configPath}`)

            const defaultConfig = YAML.parse(defaultConfigSource)

            const actualConfig = YAML.parse(fs.readFileSync(configPath, {encoding: 'utf-8'}))

            return alg.object.assignDefaultPropertiesDeep(actualConfig, defaultConfig)
        } else {
            try {
                const configPathObject = path.parse(configPath)

                if (!fs.existsSync(configPathObject.dir)) {
                    fs.mkdirSync(configPathObject.dir)
                }

                fs.writeFileSync(configPath, defaultConfigSource)
            } catch(error) {
                console.error(error)
            }

            return YAML.parse(defaultConfigSource)
        }
    } else {
        return YAML.parse(defaultConfigSource)
    }
}


module.exports = {
    configEntity: new ConfigEntity(loadDefaultConfig()),
    service: require('./config-service')
}