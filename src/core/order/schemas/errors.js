const commonSchemas = require('common/schemas')


module.exports = {
    LargeOrderTimeIntervalError: new commonSchemas.builders.ErrorSchemaBuilder('LargeOrderTimeIntervalError')
        .setMessage('Промежуток времени для отложенного заказа не может быть меньше часа')
        .setCode(3001)
        .setError('LargeOrderTimeIntervalError')
        .end(),
    PhoneNumberMissingError: new commonSchemas.builders.ErrorSchemaBuilder('PhoneNumberMissingError')
        .setMessage('Укажите номер телефона')
        .setCode(3002)
        .setError('PhoneNumberMissingError')
        .end(),
    OrderProductDoesNotExistError: new commonSchemas.builders.ErrorSchemaBuilder('OrderProductDoesNotExistError')
        .setMessage('Продукт не найден')
        .setCode(3003)
        .setError('OrderProductDoesNotExistError')
        .setAdditionallyOrigin(
            'productIds',
            {
                description: 'Идентификаторы не существующих продуктов',
                type: 'array',
                items: {
                    type: 'string'
                }
            }
        )
        .end(),
    OrderNotExistsError: new commonSchemas.builders.ErrorSchemaBuilder('OrderNotExistsError')
        .setMessage('Заказ не найден')
        .setCode(3004)
        .setError('OrderNotExistsError')
        .setAdditionallyOrigin(
            'orderId',
            {
                description: 'Идентификатор не существующего заказа',
                type: 'string'
            }
        )
        .end(),
    OrderCannotBeCanceledError: new commonSchemas.builders.ErrorSchemaBuilder('OrderCannotBeCanceledError')
        .setMessage('Вы не можете отменить этот заказ')
        .setCode(3005)
        .setError('OrderCannotBeCanceledError')
        .end()
}