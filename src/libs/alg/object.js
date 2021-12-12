

/**
 * @param {any} value
 * @return {boolean}
 */
const isObject = value =>
        typeof value === 'object'
    &&  value !== null
    &&  !Array.isArray(value)
    &&  !(value instanceof Map)
    &&  !(value instanceof Set)

const isPrimitive = value =>
        typeof value !== 'object'
    &&  typeof value !== 'function'
    || (
        typeof value === 'object'
        && !value
    )

/**
 * @callback assignDefaultPropertiesDeep
 * @summary Рекурсивно копирует свойства объекта source в объект target, если они не заданы
 * @param {Object} target
 * @param {Object} source
 * @returns {Object}
 */
function assignDefaultPropertiesDeep(target, source) {
    for (const [key, value] of Object.entries(source)) {
        if (!(key in target)) {
            target[key] = value
        } else if (isObject(value)) {
            if (!isObject(target[key])) {
                target[key] = {}
            }
            assignDefaultPropertiesDeep(target[key], source[key])
        }
    }
    return target
}

function copyingNonEnumerableProperties(object) {
    const result = {}

    for (const propertyName of Object.getOwnPropertyNames(object))
        result[propertyName] = object[propertyName]

    return result
}


module.exports = {
    isObject,
    isPrimitive,
    assignDefaultPropertiesDeep,
    copyingNonEnumerableProperties
}