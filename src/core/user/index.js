module.exports = {
    service: require('./user-service'),
    Error: require('./user-error'),
    auth: require('./packages/auth'),
    ENUM: require('./user-enum'),
    schemas: require('./schemas')
}