import * as schemas from '../schemas'
import {FastifyInstance} from 'fastify'
import {OrderService} from '@app/order/OrderService'
import {BadRequest, Created, NotFound} from '@common/schemas/response'
import {OrderCannotBeCanceledError} from '../order-error'
import {JsonSchemaValidationError, JsonSchemaValidationErrors} from '@error'
import {
  ProductsDoNotExistError,
  ProductVariantsDoNotExistError
} from '@app/product/product-error'


interface CreateRequest {
  Body: schemas.entities.CreateOrder
}

const MISSING_ADDRESS_ERROR = new JsonSchemaValidationErrors({
  in: 'body',
  errors: [new JsonSchemaValidationError({
    message: 'Укажите адрес доставки',
    code: 1002,
    error: 'JsonSchemaValidationError',
    keyword: 'required',
    schemaPath: '#/required',
    dataPath: '',
    details: {
      'missingProperty': 'address'
    }
  })]
})


export async function create(fastify: FastifyInstance, service: OrderService) {
  return fastify
    .route<CreateRequest>(
      {
        method: 'POST',
        url: '/order',
        schema: {
          summary: 'Создать заказ',
          tags: ['Заказ'],
          body: schemas.entities.CreateOrder,
          response: {
            // [201]: new Created(schemas.entities.BaseOrder, 'order'),
            [400]: new BadRequest(OrderCannotBeCanceledError.schema()).bodyErrors(),
            [404]: new NotFound(ProductsDoNotExistError.schema(), ProductVariantsDoNotExistError.schema())
          }
        },
        security: {
          auth: 'OPTIONAL'
        },
        preHandler: async function validation(request) {
          if (request.body.delivery && !request.body.address) {
            throw MISSING_ADDRESS_ERROR
          }
        },
        handler: async function(request, reply) {
          const order = await service.createOrder(request.body, request.optionalSession.userId)

          reply
            .code(201)
            .type('application/json')
            .send({order})
        }
      }
    )
}