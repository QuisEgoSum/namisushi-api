import {TestOptions} from './main'


export function productTests(options: TestOptions) {
  return function() {
    it('Продукты для заказа', async function() {
      const response1 = await options.fastify.inject({
        url: '/api/admin/product/SINGLE',
        method: 'POST',
        payload: {
          title: 'SINGLE',
          description: 'SINGLE',
          ingredients: [],
          visible: true,
          cost: 100,
          weight: 100
        },
        cookies: {sessionId: options.sessions.admin}
      })
      expect(response1.statusCode).toEqual(201)
      const response2 = await options.fastify.inject({
        url: '/api/admin/product/VARIANT',
        method: 'POST',
        payload: {
          title: 'VARIANT',
          description: 'VARIANT',
          ingredients: [],
          visible: true
        },
        cookies: {sessionId: options.sessions.admin}
      })
      expect(response2.statusCode).toEqual(201)
      const response3 = await options.fastify.inject({
        url: `/api/admin/product/VARIANT/${response2.json<{product: {_id: string}}>().product._id}/variant`,
        method: 'POST',
        payload: {
          title: 'VARIANT 1',
          visible: true,
          icon: null,
          cost: 100,
          weight: 100
        },
        cookies: {sessionId: options.sessions.admin}
      })
      expect(response3.statusCode).toEqual(201)
      console.log(response1.json())
      options.stateId.set('PRODUCT_SINGLE', response1.json().product._id)
      options.stateId.set('PRODUCT_VARIANT', response2.json().product._id)
      options.stateId.set('PRODUCT_VARIANT_1', response3.json().variant._id)
    })
  }
}