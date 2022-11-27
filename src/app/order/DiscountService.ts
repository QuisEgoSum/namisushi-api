import {OrderDiscount} from '@app/order/enums'
import {config} from '@config'
import type {InitOrder} from '@app/order/OrderService'


export class DiscountService {

  private getDiscountPercent(discount: OrderDiscount): number {
    if (discount == OrderDiscount.WEEKDAY) {
      return config.order.discount.weekday
    } else if (discount == OrderDiscount.WITHOUT_DELIVERY) {
      return config.order.discount.withoutDelivery
    } else {
      throw new Error(`Unknown discount ${discount}`)
    }
  }

  /**
   * @summary С понедельника по четверг с 11:00 до 16:00
   */
  private isWeekday(timestamp: number | null | undefined): boolean {
    const date = timestamp ? new Date(timestamp) : new Date()
    const day = date.getDay()
    const isRequiredDay = day >= 1 && day <= 4
    if (!isRequiredDay) {
      return false
    }
    const time = date.getHours() * 60 + date.getMinutes()
    return  time >= 660 && time < 960
  }

  public make(order: InitOrder) {

    const discounts: {type: OrderDiscount, percent: number}[] = []
    if (!order.delivery) {
      discounts.push({type: OrderDiscount.WITHOUT_DELIVERY, percent: this.getDiscountPercent(OrderDiscount.WITHOUT_DELIVERY)})
    }
    // if (this.isWeekday(order.time)) {
    //   discounts.push({type: OrderDiscount.WEEKDAY, percent: this.getDiscountPercent(OrderDiscount.WEEKDAY)})
    // }
    order.discount = discounts
      .sort((a, b) =>  a.percent > b.percent ? -1 : 1)[0] || null
    if (order.discount) {
      order.cost = Math.floor(order.productsSum * (100 - order.discount.percent) / 100)
    } else {
      order.cost = order.productsSum
    }
  }
}
