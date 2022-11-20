

# WebSocket(Socket.IO)

- Версия клиента `4.X.X`;

- Обязательные опции подключения:

    ```json
    {
      "path": "/ws",
      "transports": ["websocket"]
    }
    ```

- События:

    - `authorization:ok`:
      - Вызывается после успешной авторизации;
      - Не содежит полезной нагрузки.
    - `authorization:error`:
      - Вызывается в случае ошибки авторизации;
      - Пример полезной нагрузки(`UserAuthorizationError`):
        ```json
        {
          "message": "Вы не авторизованы",
          "code": 2000,
          "error": "UserAuthorizationError"
        }
        ```
    - `order:new`:
      - Вызывается после создания заказа;
      - Для пользователей с ролью `ADMIN` и `WATCHER`, а так же создателю заказа;
      - Пример полезной нагрузки(`PopulatedOrder`):
        ```json
        {
          "_id": "6263bda571a52b2d541ec5f7",
          "number": 23,
          "clientId": "4920737570657261646d696e",
          "phone": "+38(071)000-00-00",
          "address": null,
          "cost": 90,
          "weight": 300,
          "username": "Евдоким Субботин",
          "condition": "NEW",
          "delivery": false,
          "deliveryCost": null,
          "discount": { "type": "WITHOUT_DELIVERY", "percent": 10 },
          "additionalInformation": null,
          "deliveryCalculateManually": null,
          "time": null,
          "productsSum": 100,
          "products": [
            {
              "cost": 100,
              "weight": 300,
              "number": 1,
              "product": {
                "_id": "625ab27addbcb27222de91ee",
                "visible": true,
                "title": "test",
                "description": "test",
                "ingredients": ["test"],
                "images": [],
                "type": "SINGLE",
                "cost": 100,
                "weight": 300,
                "createdAt": 1650111098902,
                "updatedAt": 1650111098902
              },
              "variant": null
            }
          ],
          "isTestOrder": false,
          "createdAt": 1650703781870,
          "updatedAt": 1650703781870
        }
        ```
    - `order:condition`
      - Вызывается при обновлении статуса заказа;
      - Для пользователей с ролью ADMIN и WATCHER, а так же создателю заказа;
      - Пример полезной нагрузки:
      ```json
      {
        "_id": "6263bda571a52b2d541ec5f7",
        "condition": "COLLECTED"
      }
      ```