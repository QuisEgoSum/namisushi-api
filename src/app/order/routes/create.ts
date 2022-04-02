import * as schemas from '../schemas'
import {OrderCannotBeCanceledError} from '../order-error'
import {ProductsDoNotExistError, ProductVariantsDoNotExistError} from '@app/product/product-error'
import {UserRole} from '@app/user'
import {UserRightsError} from '@app/user/user-error'
import {JsonSchemaValidationError, JsonSchemaValidationErrors} from '@error'
import {BadRequest, Created, NotFound} from '@common/schemas/response'
import type {OrderService} from '@app/order/OrderService'
import type {UserService} from '@app/user/UserService'
import type {FastifyInstance} from 'fastify'


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


export async function create(fastify: FastifyInstance, service: OrderService, userService: UserService) {
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
            [201]: new Created(schemas.entities.PopulatedOrder, 'order'),
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
          if (request.body.isTestOrder && request.optionalSession.userRole !== UserRole.ADMIN && request.optionalSession.userRole !== UserRole.WATCHER) {
            throw new UserRightsError({message: 'Создать тестовый заказ может только администратор'})
          }
          if (!request.body.isTestOrder) {
            request.body.clientId = await userService.upsertByPhone(request.body.phone, request.body.username)
          } else {
            request.body.clientId = null
          }
        },
        handler: async function(request, reply) {
          const order = await service.createOrder(request.body)

          reply
            .code(201)
            .type('application/json')
            .send({order})
        }
      }
    )
}