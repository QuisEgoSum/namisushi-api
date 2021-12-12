/**
 * @summary С понедельника по четверг с 11:00 до 16:00
 */
function isWeekday() {
    const date = new Date()

    const day = date.getDay()

    const isRequiredDay = day >= 1 && day <= 4

    if (!isRequiredDay) {
        return false
    }

    const time = date.getHours() * 60 + date.getMinutes()

    return  time >= 660 && time < 960
}


module.exports = {
    isWeekday
}