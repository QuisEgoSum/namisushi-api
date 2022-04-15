import * as schemas from '@app/user/schemas'
import type {UserService} from '@app/user/UserService'
import type {FastifyInstance} from 'fastify'
import {BadRequest, MessageResponse} from '@common/schemas/response'
import {logger as defaultLogger} from '@logger'
import {SendOtpTimeoutError, UserRegisteredError} from '@app/user/user-error'
import {config} from '@config'


interface SignupSendRequest {
  Body: schemas.entities.SendSignupOtp
}


export async function signupSend(fastify: FastifyInstance, service: UserService) {
  const logger = defaultLogger.child({label: 'signup-send'})
  return fastify
    .route<SignupSendRequest>({
      url: '/user/signup/send',
      method: 'POST',
      schema: {
        summary: 'Отправить OTP код',
        tags: ['Пользователь'],
        body: schemas.entities.SendSignupOtp,
        response: {
          [200]: new MessageResponse('На ваш номер телефона отправлен код'),
          [400]: new BadRequest(UserRegisteredError.schema(), SendOtpTimeoutError.schema()).bodyErrors()
        }
      },
      security: {
        auth: false
      },
      handler: async function(request, reply) {
        const code = await service.sendSignupOtp(request.body.phone)

        logger.info(`Phone ${request.body.phone} send code ${code}`)

        if (config.user.otp.debug) {
          reply
            .header("x-code", code)
        }

        reply
          .code(200)
          .type('application/json')
          .send({message: 'На ваш номер телефона отправлен код'})
      }
    })
}