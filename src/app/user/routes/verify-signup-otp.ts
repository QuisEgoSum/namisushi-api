import * as schemas from '@app/user/schemas'
import {InvalidOtpCodeError} from '@app/user/user-error'
import {DocsTags} from '@app/docs'
import {BadRequest, NoContent} from '@common/schemas/response'
import type {UserService} from '@app/user/UserService'
import type {FastifyInstance} from 'fastify'


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
          tags: [DocsTags.USER],
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