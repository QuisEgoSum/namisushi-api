# Env list

| name                                                 | description          | type            | valid                                  |
|------------------------------------------------------|----------------------|-----------------|----------------------------------------|
| NAMISUSHI_API_CONFIG                                 | Path to the yml file | string          |                                        |
| NAMISUSHI_API_PRODUCTION                             |                      | boolean         |                                        |
| NAMISUSHI_API_SERVER_ADDRESS_API                     |                      | string          |                                        |
| NAMISUSHI_API_SERVER_ADDRESS_ADMIN                   |                      | string          |                                        |
| NAMISUSHI_API_SERVER_ADDRESS_USER                    |                      | string          |                                        |
| NAMISUSHI_API_SERVER_HTTP_ADDRESS                    |                      | string          |                                        |
| NAMISUSHI_API_SERVER_HTTP_PORT                       |                      | integer         | Range: 1...65353                       |
| NAMISUSHI_API_SERVER_TELEGRAM_TOKEN                  |                      | string          |                                        |
| NAMISUSHI_API_SERVER_TELEGRAM_ENABLE_BOT             |                      | boolean         |                                        |
| NAMISUSHI_API_SERVER_TELEGRAM_ENABLE_WEBHOOK         |                      | boolean         |                                        |
| NAMISUSHI_API_SERVER_TELEGRAM_WEBHOOK_PORT           |                      | integer         | Range: 1...65353                       |
| NAMISUSHI_API_SERVER_TELEGRAM_WEBHOOK_HOOK_PATH      |                      | string          |                                        |
| NAMISUSHI_API_SERVER_TELEGRAM_WEBHOOK_DOMAIN         |                      | string          |                                        |
| NAMISUSHI_API_SERVER_WS_PORT                         |                      | integer         | Range: 1...65353                       |
| NAMISUSHI_API_LOGGER_PRETTY                          |                      | boolean         |                                        |
| NAMISUSHI_API_LOGGER_ISO_TIME                        |                      | boolean         |                                        |
| NAMISUSHI_API_LOGGER_TIME                            |                      | boolean         |                                        |
| NAMISUSHI_API_LOGGER_LEVEL                           |                      | string          | enum: <br />-info;<br />-debug.        |
| NAMISUSHI_API_USER_OTP_DEBUG                         |                      | boolean         |                                        |
| NAMISUSHI_API_USER_SESSION_MAXIMUM                   |                      | integer         | Range: 1...                            |
| NAMISUSHI_API_USER_SESSION_COOKIE_PATH               |                      | string          |                                        |
| NAMISUSHI_API_USER_SESSION_COOKIE_DOMAIN             |                      | string          |                                        |
| NAMISUSHI_API_USER_SESSION_COOKIE_SAME_SITE          |                      | string, boolean |                                        |
| NAMISUSHI_API_USER_SESSION_COOKIE_MAX_AGE            |                      | integer         |                                        |
| NAMISUSHI_API_USER_SUPERADMIN_PASSWORD               |                      | string          | Length: 6...1024                       |
| NAMISUSHI_API_USER_SUPERADMIN_USERNAME               |                      | string          | Length: 1...24                         |
| NAMISUSHI_API_USER_SUPERADMIN_EMAIL                  |                      | string          |                                        |
| NAMISUSHI_API_DATABASE_CREDENTIALS_CONNECTION_STRING |                      | string          |                                        |
| NAMISUSHI_API_DATABASE_OPTIONS_USE_NEW_URL_PARSER    |                      | boolean         |                                        |
| NAMISUSHI_API_DATABASE_OPTIONS_USE_UNIFIED_TOPOLOGY  |                      | boolean         |                                        |
| NAMISUSHI_API_DATABASE_OPTIONS_IGNORE_UNDEFINED      |                      | boolean         |                                        |
| NAMISUSHI_API_DATABASE_OPTIONS_KEEP_ALIVE            |                      | boolean         |                                        |
| NAMISUSHI_API_PRODUCT_IMAGE_MAXIMUM                  |                      | integer         |                                        |
| NAMISUSHI_API_PRODUCT_IMAGE_FILE_MAXIMUM_SIZE        |                      | integer         |                                        |
| NAMISUSHI_API_PRODUCT_IMAGE_FILE_DESTINATION         |                      | string          |                                        |
| NAMISUSHI_API_PRODUCT_VARIANT_ICON_DESTINATION       |                      | string          |                                        |
| NAMISUSHI_API_PRODUCT_VARIANT_ICON_MAXIMUM_SIZE      |                      | integer         | Range: 1...                            |
| NAMISUSHI_API_PRODUCT_TAG_ICON_DESTINATION           |                      | string          |                                        |
| NAMISUSHI_API_PRODUCT_TAG_ICON_MAXIMUM_SIZE          |                      | integer         | Range: 1...                            |
| NAMISUSHI_API_ORDER_DISCOUNT_WITHOUT_DELIVERY        |                      | integer         |                                        |
| NAMISUSHI_API_ORDER_DISCOUNT_WEEKDAY                 |                      | integer         |                                        |
| NAMISUSHI_API___ON_SUCCESSFUL                        |                      | string          | enum: <br />-onResponse;<br />-onSend. |
