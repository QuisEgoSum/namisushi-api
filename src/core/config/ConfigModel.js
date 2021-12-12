const {Schema, model} = require('mongoose')
const pkgjson = require('../../../package.json')


const ConfigSchema = new Schema(
    {
        version: {
            type: String,
            default: pkgjson.version
        },
        telegram: {
            adminIds: {
                type: Array,
                items: {
                    type: Number
                }
            },
            superadminIds: {
                type: Array,
                items: {
                    type: Number
                }
            }
        }
    },
    {
        capped: true,
        size: 999999,
        max: 1,
        timestamps: false,
        versionKey: false
    }
)


module.exports = model('Config', ConfigSchema, 'config')