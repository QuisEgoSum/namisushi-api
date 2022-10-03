import * as schemas from '../schemas'
import {DocsTags} from '@app/docs'
import {BadRequest, MessageResponse, TooEarly} from '@common/schemas/response'
import {UserService} from '@app/user'
import type {FastifyInstance} from 'fastify'
import {config} from '@config'
import {SendOtpDayLimitError, SendOtpPhoneDayLimitError, SendOtpTimeoutError} from '@app/user/packages/otp/otp-error'


interface CallOtpRequest {
  Body: schemas.entities.CallOtp
}


export async function callOtp(fastify: FastifyInstance, service: UserService) {
  return fastify
    .route<CallOtpRequest>(
      {
        url: '/user/signin/call',
        method: 'POST',
        schema: {
          summary: 'Звонок с кодом авторизации в номере',
          tags: [DocsTags.USER],
          body: schemas.entities.CallOtp,
          response: {
            [200]: new MessageResponse().addHeaders({
              'x-code': {
                type: 'string',
                description: 'В `debug` режиме будет содержать отправленный код авторизации'
              }
            }),
            [400]: new BadRequest().bodyErrors(),
            [429]: new TooEarly(
              SendOtpPhoneDayLimitError.schema(),
              SendOtpTimeoutError.schema(),
              SendOtpDayLimitError.schema()
            )
          }
        },
        security: {
          auth: false
        },
        handler: async function(request, reply) {
          const code = await service.callOtpCode(request.body.phone)

          if (config.user.otp.debug) {
            reply
              .header('x-code', code)
          }

          reply
            .code(200)
            .type('application/json')
            .send({message: 'Ожидайте звонка, последние 4 цифры номера являются кодом авторизации'})
        }
      }
    )
}
