import * as schemas from '@app/user/schemas'
import {SendOtpTimeoutError, UserRegisteredError} from '@app/user/user-error'
import {DocsTags} from '@app/docs'
import {BadRequest, MessageResponse} from '@common/schemas/response'
import {config} from '@config'
import {logger as defaultLogger} from '@logger'
import type {UserService} from '@app/user/UserService'
import type {FastifyInstance} from 'fastify'


interface SignUpSendRequest {
  Body: schemas.entities.SendSignUpOtp
}


export async function signUpSend(fastify: FastifyInstance, service: UserService) {
  const logger = defaultLogger.child({label: 'sign-up-send'})
  return fastify
    .route<SignUpSendRequest>({
      url: '/user/signup/send',
      method: 'POST',
      schema: {
        summary: 'Отправить OTP код',
        tags: [DocsTags.USER],
        body: schemas.entities.SendSignUpOtp,
        response: {
          [200]: new MessageResponse('На ваш номер телефона отправлен код'),
          [400]: new BadRequest(UserRegisteredError.schema(), SendOtpTimeoutError.schema()).bodyErrors()
        }
      },
      security: {
        auth: false
      },
      handler: async function(request, reply) {
        const code = await service.sendSignUpOtp(request.body.phone)

        logger.info(`Phone ${request.body.phone} send code ${code}`)

        if (config.user.otp.debug) {
          reply
            .header('x-code', code)
        }

        reply
          .code(200)
          .type('application/json')
          .send({message: 'На ваш номер телефона отправлен код'})
      }
    })
}