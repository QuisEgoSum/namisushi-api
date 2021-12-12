Path /ws


Events
==

- "connection" - происходит после успешной авторизации
- "subscribe-admin" - событие для подписки
  - "new-orders" - подписаться на новые заказы (заказы приходят на топик "new-order")
- "unsubscribe-admin" - описаться по названию подписки
- "debug"
    - отсылает уведомление об успешной подписке/отписке\
- "new-order"

  {order: OrderExpand}
