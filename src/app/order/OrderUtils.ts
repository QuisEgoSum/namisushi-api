import {OrderCondition, OrderDiscount, OrderTelegramEvent} from '@app/order/enums'
import {PopulatedOrder} from '@app/order/schemas/entities'
import {config} from '@config'
import {Types} from 'mongoose'


export class OrderUtils {
  private static readonly ORDER_DISCOUNT_DESCRIPTION = {
    [OrderDiscount.WITHOUT_DELIVERY]: 'Самовывоз',
    [OrderDiscount.WEEKDAY]: 'Будний день'
  }
  private static readonly ORDER_CONDITION_DESCRIPTION = {
    [OrderCondition.NEW]: 'Новый',
    [OrderCondition.IN_PROGRESS]: 'Принят',
    [OrderCondition.IN_THE_WAY]: 'Доставляется',
    [OrderCondition.IS_DELIVERED]: 'Доставлен',
    [OrderCondition.DONE]: 'Выполнен',
    [OrderCondition.REJECT]: 'Отклонён',
    [OrderCondition.CANCELLED]: 'Отменён',
    [OrderCondition.COLLECTED]: 'Собран'
  }

  public static parseOrder(order: PopulatedOrder): string[] {
    const orderTexts = []

    if (order.isTestOrder) {
      orderTexts.push(`[ТЕСТОВЫЙ ЗАКАЗ! №${order.number}](${config.server.address.admin}/order/${order.number}?isTestOrder=true)\n`)
    } else {
      orderTexts.push(`[Новый заказ! №${order.number}](${config.server.address.admin}/order/${order.number})\n`)
    }

    orderTexts.push(`Имя: ${order.username}\n`,)
    if (order.delivery) {
      orderTexts.push(`Адрес доставки: \`${order.address}\`\n`)
    } else {
      orderTexts.push('Самовывоз\n')
    }
    if (order.time) {
      orderTexts.push(`Время выполнения: ${new Date(order.time).toLocaleString()}\n`)
    }
    if (order.additionalInformation) {
      orderTexts.push(`Доп. информация: ${order.additionalInformation}\n`)
    }
    const phone = order.phone
      .replace('(', '')
      .replace(')', '')
      .replace('-', '')
    orderTexts.push(`[${order.phone}](tel:${phone})\n\n`)
    orderTexts.push('*Заказ:*\n')
    order.products.forEach((product, index) => {
      if (product.product?.type === 'VARIANT') {
        orderTexts.push(`*${index + 1}.* ${product.product?.title}(${product.variant?.title}), ${product.variant?.cost}₽, ${product.number}x\n`)
      } else {
        orderTexts.push(`*${index + 1}.* ${product.product?.title}, ${product.product?.cost}₽, ${product.number}x\n`)
      }
    })
    orderTexts.push('\n')
    if (order.deliveryCalculateManually) {
      orderTexts.push('Стоимость доставки не была рассчитана\n')
    } else if (order.delivery) {
      orderTexts.push(`Стоимость доставки: *${order.deliveryCost}₽*\n`)
    }
    if (order.discount) {
      orderTexts.push(`Скидка "${OrderUtils.ORDER_DISCOUNT_DESCRIPTION[order.discount.type]}" *${order.discount.percent}%*\n`)
    }
    orderTexts.push(`Суммарная стоимость заказа: *${order.cost}₽*\n`)
    orderTexts.push(`Статус: ` + OrderUtils.ORDER_CONDITION_DESCRIPTION[order.condition])
    return orderTexts
  }

  static replaceStatus(message: string, condition: OrderCondition) {
    const split = message.split('\n')
    split[split.length - 1] = 'Статус: ' + OrderUtils.ORDER_CONDITION_DESCRIPTION[condition]
    return split.join('\n')
  }

  private static createKeyboard(
    text: string,
    event: OrderTelegramEvent,
    orderId: string | Types.ObjectId
  ): {text: string, callback_data: string} {
    return {
      text: text,
      callback_data: JSON.stringify([event, String(orderId)])
    }
  }

  static statusKeyboards(
    orderId: string | Types.ObjectId,
    condition: OrderCondition,
    delivery: boolean
  ): {text: string, callback_data: string}[][] {
    if (condition == OrderCondition.NEW) {
      return [[
        OrderUtils.createKeyboard('Принять', OrderTelegramEvent.IN_PROGRESS, orderId),
        OrderUtils.createKeyboard('Отклонить', OrderTelegramEvent.REJECT, orderId)
      ]]
    }
    if (condition == OrderCondition.REJECT) {
      return []
    }
    if (condition == OrderCondition.IN_PROGRESS) {
      return [[
        delivery
          ? OrderUtils.createKeyboard('Доставляется', OrderTelegramEvent.IN_THE_WAY, orderId)
          : OrderUtils.createKeyboard('Собран', OrderTelegramEvent.COLLECTED, orderId),
        OrderUtils.createKeyboard('Отклонить', OrderTelegramEvent.REJECT, orderId)
      ]]
    }
    if (condition == OrderCondition.IN_THE_WAY) {
      return [[
        OrderUtils.createKeyboard('Доставлен', OrderTelegramEvent.IS_DELIVERED, orderId),
        OrderUtils.createKeyboard('Отклонить', OrderTelegramEvent.REJECT, orderId)
      ]]
    }
    if (condition == OrderCondition.IS_DELIVERED) {
      return [[
        OrderUtils.createKeyboard('Выполнен', OrderTelegramEvent.DONE, orderId),
        OrderUtils.createKeyboard('Отклонить', OrderTelegramEvent.REJECT, orderId)
      ]]
    }
    if (condition == OrderCondition.COLLECTED) {
      return [[
        OrderUtils.createKeyboard('Выполнен', OrderTelegramEvent.DONE, orderId),
        OrderUtils.createKeyboard('Отклонить', OrderTelegramEvent.REJECT, orderId)
      ]]
    }
    return []
  }
}