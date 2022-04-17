import {PopulatedOrder, RawPopulatedOrder} from '@app/order/schemas/entities'


export function rawPopulatedTransform(order: RawPopulatedOrder): PopulatedOrder {
  const products = new Map(order._products.map(product => [String(product._id), product]))
  const variants = new Map(order._variants.map(variant => [String(variant._id), variant]))
  return {
    _id: order._id,
    number: order.number,
    clientId: order.clientId ? String(order.clientId) : null,
    phone: order.phone,
    address: order.address,
    cost: order.cost,
    weight: order.weight,
    username: order.username,
    condition: order.condition,
    delivery: order.delivery,
    deliveryCost: order.deliveryCost,
    discount: order.discount,
    additionalInformation: order.additionalInformation,
    deliveryCalculateManually: order.deliveryCalculateManually,
    time: order.time,
    productsSum: order.productsSum,
    products: order.products.map(product => ({
      cost: product.cost,
      weight: product.weight,
      number: product.number,
      product: products.get(String(product.productId)) || null,
      variant: variants.get(String(product.variantId)) || null
    })),
    isTestOrder: order.isTestOrder,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt
  }
}