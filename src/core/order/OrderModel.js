const {Schema, model} = require('mongoose')
const ORDER_ENUM = require('./order-enum')


const OrderSchema = new Schema(
    {
        products: {
            type: Array,
            items: {
                type: Object,
                properties: {
                    product: {
                        type: Schema.Types.ObjectId,
                        ref: 'Product'
                    },
                    number: {
                        type: Number
                    },
                    cost: {
                        type: Number
                    },
                    weight: {
                        type: Number
                    }
                }
            }
        },
        client: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        phone: {
            type: String
        },
        address: {
            type: String
        },
        cost: {
            type: Number
        },
        username: {
            type: String
        },
        additionalInformation: {
            type: String
        },
        condition: {
            //0 - new
            //10 - in process
            //20 - in the way
            //30 - is delivered
            //40 - reject
            type: Number,
            default: ORDER_ENUM.CONDITION[0],
            enum: ORDER_ENUM.CONDITION.values()
        },
        weight: {
            //gram
            type: Number
        },
        delivery: {
            /**
             * true - доставка
             * false - самовывоз
             */
            type: Boolean,
            default: false
        },
        deliveryCost: {
            type: Number
        },
        deliveryCalculateManually: {
            type: Boolean
        },
        time: {
            type: Number
        },
        discount: {
            type: String,
            enum: ORDER_ENUM.ORDER_DISCOUNT.values()
        },
        createdAt: {
            type: Number
        },
        updatedAt: {
            type: Number
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)


OrderSchema.index({client: 1})
OrderSchema.index({_id: 1, client: 1})
OrderSchema.index({condition: 1})
OrderSchema.index({createdAt: 1})


module.exports = model('Order', OrderSchema, 'orders')