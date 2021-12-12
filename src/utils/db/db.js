const mongoose = require('mongoose')
const Config = require('core/config')
const config = require('../../config')
const bcrypt = require('bcrypt')
const uuid = require('uuid')


/**
 * @param {String} connectString 
 */
async function connect(connectString) {

    const res = await mongoose.connect(connectString, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true
    })

    mongoose.connection.once('disconnected', () => connect(connectString))

    return res
}

async function init() {
    const timestamp = Date.now()

    await mongoose.connection.collection('users')
        .updateOne(
            {
                _id: mongoose.Types.ObjectId(config.user.superadmin.id)
            },
            {
                $set: {
                    email: config.user.superadmin.email,
                    emailVerified: true,
                    role: 'Admin',
                    hash: await bcrypt.hash(String(config.user.superadmin.password), 10),
                    updatedAt: timestamp
                },
                $setOnInsert: {
                    avatar: `#random=${uuid.v4()}`,
                    createdAt: timestamp
                }
            },
            {
                upsert: true
            }
        )

    await Config.service.init()
}


module.exports = {
    connect,
    init
}