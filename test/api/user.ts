import {TestOptions} from './main'
import {config} from '@config'


export function userTests(options: TestOptions) {
  return function() {
    it('Валидация авторизации', async function() {
      async function inject(body: Record<string, string | null>, expectedErrorCode = 1001) {
        const response = await options.fastify.inject({
          url: '/user/signin',
          method: 'POST',
          payload: body
        })
        const json = response.json()
        expect(json.error.code).toEqual(expectedErrorCode)
      }
      const password = '1324fdsf3'
      const login = 'dgfwsfsfds'
      const phone = '+38(071)423-11-00'
      const code = '0000'

      await inject({password, login}, 2002)
      await inject({phone, code}, 2008)
      await inject({password, login, code})
      await inject({password, login, phone})
      await inject({password, login, phone, code})
      await inject({phone, code, password})
      await inject({phone, code, login})
      await inject({phone, code, login, password})
      await inject({phone, code, login: null}, 2008)
      await inject({phone, code, password: null}, 2008)
      await inject({phone, code, login: null, password: null}, 2008)
      await inject({password, login, phone: null}, 2002)
      await inject({password, login, code: null}, 2002)
      await inject({password, login, phone: null, code: null}, 2002)
    })
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