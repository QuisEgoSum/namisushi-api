import {TestOptions} from './main'
import {config} from '@config'


export function userTests(options: TestOptions) {
  return function() {
    it('Авторизация админом', async function() {
      const response = await options.fastify.inject({
        url: '/user/signin',
        method: 'POST',
        payload: {
          login: config.user.superadmin.email,
          password: config.user.superadmin.password
        }
      })
      expect(response.statusCode).toEqual(200)
      // @ts-ignore
      options.sessions.admin = response.cookies[0].value
    })
  }
}