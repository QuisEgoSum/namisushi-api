import {config} from '@config'
import * as schemas from '../schemas'
import type {FastifyInstance} from 'fastify'
import type {UserService} from '@app/user/UserService'


interface SigninUser {
  Body: schemas.entities.UserCredentials
}


export async function signin(fastify: FastifyInstance, service: UserService) {
  return fastify
    .route<SigninUser>(
      {
        url: '/user/signin',
        method: 'POST',
        schema: {
          summary: 'User sing in',
          tags: ['User - Me'],
          body: schemas.entities.UserCredentials,
          headers: {
            'x-localhost': {
              description: 'Any value for set cookie for the localhost domain',
              type: 'string'
            }
          },
          response: {
            [200]: {
              description: 'User',
              type: 'object',
              properties: {
                user: schemas.entities.UserBase
              },
              additionalProperties: false,
              required: ['user']
            }
          }
        },
        security: {
          auth: false
        },
        handler: async function(request, reply) {
          const {user, sessionId} = await service.signin(request.body)

          let cookieOptions = config.user.session.cookie

          if (request.headers['x-localhost']) {
            cookieOptions = {
              ...cookieOptions,
              domain: 'localhost'
            }
          }

          reply
            .setCookie('sessionId', sessionId, cookieOptions)
            .code(200)
            .type('application/json')
            .send({user})
        }
      }
    )
}