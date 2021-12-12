/**
 * @param {String} cookieString 
 * @returns {Object.<string, String>}
 */
module.exports.parse = function (cookieString) {
    if (!cookieString || typeof cookieString !== 'string')
        return {}
    return cookieString.split('; ').reduce((a, c) => {
        let [key, value] = c.split('=')
        if (value[value.length - 1] === ';')
            value = value.slice(0, value.length - 1)
        a[key] = value
        return a
    }, {})
}