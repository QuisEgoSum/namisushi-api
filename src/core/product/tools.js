

/**
 * @param {Array.<String>} target 
 * @param {Array.<String>} source 
 */
function notContain(target, source) {

    source = [...source]

    /** @type {Array.<String>} */
    const result = []

    for (let i = 0; i < target.length; i++) {
        let contain = false
        for (let q = 0; q < source.length; q++) {
            if (target[i] === source[q]) {
                contain = true
                source.splice(q, 1)
                break
            }
        }
        if (!contain) {
            result.push(target[i])
        }
    }

    return result
}



module.exports = {
    notContain
}