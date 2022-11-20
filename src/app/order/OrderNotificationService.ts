import {PopulatedOrder} from '@app/order/schemas/entities'
import {OrderCondition} from '@app/order/enums'
import {NotificationService} from '@app/notification'
import {OrderUtils} from '@app/order/OrderUtils'
import {OrderTelegramRepository} from '@app/order/OrderTelegramRepository'
import {Telegram} from '../../server/telegram/Telegram'
import {Types} from 'mongoose'


export class OrderNotificationService {

  constructor(
    private readonly notificationService: NotificationService,
    private readonly telegramRepository: OrderTelegramRepository,
    private readonly telegram: Telegram
  ) {}

  async newOrder(order: PopulatedOrder) {
    const telegramMessages = await this.notificationService.newOrder(
      order,
      OrderUtils.parseOrder(order),
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: OrderUtils.statusKeyboards(order._id, OrderCondition.NEW, order.delivery)
        }
      }
    )
    const promises = []
    for (const message of telegramMessages) {
      const lastMessage = message.messages[message.messages.length - 1]
      promises.push(
        this.telegramRepository.create(
          {
            chatId: message.chatId,
            orderId: order._id,
            messageId: lastMessage.id,
            message: lastMessage.message
          }
        )
      )
    }
    await Promise.all(promises)
  }

  async updateStatus(orderId: string, condition: OrderCondition, delivery: boolean, clientId: string | Types.ObjectId) {
    await this.notificationService.updateStatus(String(clientId), orderId, condition)
    const orderIdObjectId = new Types.ObjectId(orderId)
    const [message, messages] = await Promise.all([
      this.telegramRepository.findOne({orderId: orderIdObjectId}, {message: 1}),
      this.telegramRepository.find({orderId: orderIdObjectId}, {messageId: 1, chatId: 1})
    ])
    if (message) {
      const messageText = OrderUtils.replaceStatus(message.message, condition)
      const promises = []
      for (const msg of messages) {
        promises.push(
          this.telegram.updateMessage(
            msg.chatId,
            msg.messageId,
            messageText,
            {
              parse_mode: 'Markdown',
              reply_markup: {
                inline_keyboard: OrderUtils.statusKeyboards(orderId, condition, delivery)
              }
            }
          )
        )
      }
      await Promise.all(promises)
    }
  }
}