import type {Telegraf} from 'telegraf'
import {PopulatedOrder} from '../order/schemas/entities'
import {UserService} from '@app/user/UserService'
import {OrderDiscount} from '@app/order/OrderDiscount'


export class NotificationTelegramAgent {
  private static readonly MAX_MESSAGE_LENGTH = 4096

  private static readonly ORDER_DISCOUNT_DESCRIPTION = {
    [OrderDiscount.WITHOUT_DELIVERY]: 'Самовывоз',
    [OrderDiscount.WEEKDAY]: 'Будний день'
  }

  private static arrayStringToMessages(strings: string[], joinSeparator = '', splitSeparators = ['\n', ' ']): string[] {
    const totalSize = strings.reduce((acc, cur) => acc + cur.length, 0) + (strings.length - 1) * joinSeparator.length
    if (totalSize <= NotificationTelegramAgent.MAX_MESSAGE_LENGTH) {
      return [strings.join(joinSeparator)]
    } else {
      if (strings.find(string => string.length > NotificationTelegramAgent.MAX_MESSAGE_LENGTH) === undefined) {
        const messages = []
        let currentMessage = ''
        for (const string of currentMessage) {
          if (string.length + currentMessage.length <= NotificationTelegramAgent.MAX_MESSAGE_LENGTH - joinSeparator.length) {
            if (currentMessage) {
              currentMessage = string
            } else {
              currentMessage += joinSeparator + string
            }
          } else {
            messages.push(currentMessage)
            currentMessage = string
          }
        }
        messages.push(currentMessage)
        return messages
      } else {
        return NotificationTelegramAgent.arrayStringToMessages(
          strings.map(
            string => {
              if (string.length > NotificationTelegramAgent.MAX_MESSAGE_LENGTH) {
                return string.split(splitSeparators[0] || '')
              } else {
                return string
              }
            }
          ).flat(),
          joinSeparator,
          splitSeparators.slice(1)
        )
      }
    }
  }

  constructor(
    private readonly bot: Telegraf,
    private readonly userService: UserService
  ) {}

  private async sendMessages(ids: number[], messages: string[]) {
    await Promise.all(ids.map(id => messages.map(message => this.bot.telegram.sendMessage(id, message, {parse_mode: 'Markdown'}))).flat())
  }

  public async newOrderHandler(order: PopulatedOrder) {
    const orderTexts = [
      '*Новый заказ!*\n',
      `Имя: ${order.username}\n`,
    ]
    if (order.delivery) {
      orderTexts.push(`Адрес доставки: \`${order.address}\`\n`)
    } else {
      orderTexts.push('Самовывоз\n')
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
      orderTexts.push(`Скидка "${NotificationTelegramAgent.ORDER_DISCOUNT_DESCRIPTION[order.discount.type]}" *${order.discount.percent}%*\n`)
    }
    orderTexts.push(`Суммарная стоимость заказа: *${order.cost}₽*\n`)
    const messages = NotificationTelegramAgent.arrayStringToMessages(orderTexts)
    const recipientIds = await this.userService.distinctAdminTelegramIds()
    await this.sendMessages(recipientIds, messages)
  }
}