import {OrderDiscount} from '@app/order'
import {PopulatedOrder} from '@app/order/schemas/entities'
import {config} from '@config'
import os from 'os'


export class NotificationMessageUtils {
  private static readonly TELEGRAM_MAX_MESSAGE_LENGTH = 4096

  private static readonly ORDER_DISCOUNT_DESCRIPTION = {
    [OrderDiscount.WITHOUT_DELIVERY]: 'Самовывоз',
    [OrderDiscount.WEEKDAY]: 'Будний день'
  }

  public static telegramMessageReplacer(message: string | string[], joinSeparator = '', splitSeparators = ['\n', ' ']): string[] {
    if (typeof message === 'string') {
      message = [message]
    }
    const totalSize = message.reduce((acc, cur) => acc + cur.length, 0) + (message.length - 1) * joinSeparator.length
    if (totalSize <= NotificationMessageUtils.TELEGRAM_MAX_MESSAGE_LENGTH) {
      return [message.join(joinSeparator)]
    } else {
      if (message.find(string => string.length > NotificationMessageUtils.TELEGRAM_MAX_MESSAGE_LENGTH) === undefined) {
        const messages = []
        let currentMessage = ''
        for (const string of currentMessage) {
          if (string.length + currentMessage.length <= NotificationMessageUtils.TELEGRAM_MAX_MESSAGE_LENGTH - joinSeparator.length) {
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
        return NotificationMessageUtils.telegramMessageReplacer(
          message.map(
            string => {
              if (string.length > NotificationMessageUtils.TELEGRAM_MAX_MESSAGE_LENGTH) {
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

  public static parseOrder(order: PopulatedOrder): string[] {
    const orderTexts = []

    if (order.isTestOrder) {
      orderTexts.push(`*ТЕСТОВЫЙ ЗАКАЗ! №${order.number}*\n`)
    } else {
      orderTexts.push(`*Новый заказ! №${order.number}*\n`)
    }

    orderTexts.push(`Имя: ${order.username}\n`,)
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
      orderTexts.push(`Скидка "${NotificationMessageUtils.ORDER_DISCOUNT_DESCRIPTION[order.discount.type]}" *${order.discount.percent}%*\n`)
    }
    orderTexts.push(`Суммарная стоимость заказа: *${order.cost}₽*\n`)
    return orderTexts
  }

  private static formatLogObject(s: string, o: object): string[] {
    if (s) {
      s += '.'
    }
    const result = []
    for (const [key, value] of Object.entries(o)) {
      if (typeof value === 'object' && value !== null) {
        result.push(...NotificationMessageUtils.formatLogObject(s + key, value))
      } else {
        result.push(s + key + ': ' + value)
      }
    }
    return result
  }

  public static parseLog(level: 'ERROR' | 'FATAL', log: string): string[] {
    return [`*${level} NOTIFICATION*\n`, '```', ...NotificationMessageUtils.formatLogObject('', JSON.parse(log)), '```']
  }

  public static getStartMessage(): string[] {
    return [
      'APPLICATION STARTED\n\n',
      `local network:\n`,
      ` - http: 127.0.0.1:${config.server.http.port}\n`,
      // ` - ws: 127.0.0.1:${config.server.ws.port}\n\n`,
      `Domain: ${config.server.http.protocol}://${config.server.http.host}\n\n`,
      `OS:\n`,
      `- hostname: ${os.hostname()}\n`,
      `- platform: ${os.platform()}\n`,
      `- release: ${os.release()}\n`,
      `- version: ${os.version()}\n`,
      `- cpus ${os.cpus().length} ${os.cpus()[0].model}\n`,
      `- arch: ${os.arch()}\n`,
      `- homedir: ${os.homedir()}\n`,
      (os.networkInterfaces().eth0?.[0]?.address
        ? `- public network: ${os.networkInterfaces().eth0?.[0]?.address}\n`
        : ''),
      `- memory:\n`,
      ` - total: ${os.totalmem()}\n`,
      ` - free: ${os.freemem()}\n`,
      `- load ${os.loadavg().join('|')}\n\n`,
      `timestamp: ${new Date().toUTCString()}`
    ]
  }

  static getShutdownMessage(event: string) {
    return [`*APPLICATION SHUTDOWN*\n\n`, `event: ${event}\n\n`, `timestamp: ${new Date().toUTCString()}`]
  }
}