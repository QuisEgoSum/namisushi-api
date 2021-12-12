const telegramBot = require('bot')

/**
 * @param {OrderPopulated} order
 * @returns {String|Array<String>}
 */
function orderToMessage(order) {
    const orderMessage = []

    orderMessage.push('*Новый заказ!*\n')

    if (order.username) {
        orderMessage.push(`Имя: ${order.username}\n`)
    }
    if (order.delivery) {
        orderMessage.push(`Адрес: \`${order.address}\`\n`)
    } else {
        orderMessage.push('Самовывоз\n')
    }
    if (order.additionalInformation) {
        orderMessage.push(`Доп. информация: ${order.additionalInformation}\n`)
    }

    if (order.phone) {
        let phone = order.phone
            .replace('(', '')
            .replace(')', '')
            .replace('-', '')
        orderMessage.push(`[${order.phone}](tel:${phone})\n\n`)
    }

    orderMessage.push('*Заказ:*\n')

    order.products.forEach((product, index) => {
        orderMessage.push(`*${index + 1}.* ${product.product.title}, ${product.product.cost}₽, ${product.count}x\n`)
    })

    orderMessage.push(`\nСтоимость заказа: *${order.cost}₽*\n`)

    if (order.deliveryCalculateManually) {
        orderMessage.push('Стоимость доставки не была рассчитана\n')
    } else {
        orderMessage.push(`Стоимость доставки: *${order.deliveryCost}₽*\n`)
        orderMessage.push(`Всего: *${order.cost + order.deliveryCost}₽*`)
    }

    return telegramBot.arrayStringToMessage(orderMessage)
}


module.exports = {
    orderToMessage
}