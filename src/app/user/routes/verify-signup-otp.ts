import * as schemas from '../schemas'
import {BadRequest, NoContent} from '@common/schemas/response'
import type {FastifyInstance} from 'fastify'
import type {UserService} from '@app/user/UserService'
import {InvalidOtpCodeError} from '@app/user/user-error'

interface VerifySignupOtpRequest {
  Body: schemas.entities.VerifyOtp
}

export async function verifySignupOtp(fastify: FastifyInstance, service: UserService) {
  return fastify
    .route<VerifySignupOtpRequest>(
      {
        url: '/user/signup/verify',
        method: 'POST',
        schema: {
          summary: 'Верифицировать OTP код',
          tags: ['Пользователь'],
          body: schemas.entities.VerifyOtp,
          response: {
            [204]: new NoContent(),
            [400]: new BadRequest(InvalidOtpCodeError.schema()).bodyErrors()
          }
        },
        security: {
          auth: false
        },
        handler: async function(request, reply) {
          await service.verifyOtp(request.body)

          reply
            .code(204)
            .send()
        }
      }
    )
}