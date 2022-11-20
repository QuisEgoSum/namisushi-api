import {Telegram} from '../../server/telegram/Telegram'
import {OrderCondition, OrderTelegramEvent} from '@app/order/enums'
import {OrderService} from '@app/order/OrderService'


const TELEGRAM_EVENT_TO_UPDATE_CONDITION: [OrderTelegramEvent, OrderCondition][] = [
  [OrderTelegramEvent.IN_PROGRESS, OrderCondition.IN_PROGRESS],
  [OrderTelegramEvent.REJECT, OrderCondition.REJECT],
  [OrderTelegramEvent.IN_THE_WAY, OrderCondition.IN_THE_WAY],
  [OrderTelegramEvent.DONE, OrderCondition.DONE],
  [OrderTelegramEvent.IS_DELIVERED, OrderCondition.IS_DELIVERED],
  [OrderTelegramEvent.COLLECTED, OrderCondition.COLLECTED]
]


export function register(telegram: Telegram, service: OrderService) {
  for (const [event, condition] of TELEGRAM_EVENT_TO_UPDATE_CONDITION) {
    telegram.registerCallbackHandler<[string]>(
      {
        event: event,
        handler: async function(ctx, [orderId]) {
          await service.updateStatusById(orderId, condition)
          await ctx.answerCbQuery()
        },
        security: {
          admin: true
        }
      }
    )
  }
}