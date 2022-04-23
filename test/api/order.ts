import {TestOptions} from './main'


export function orderTests(options: TestOptions) {
  return function() {
    it('Без доставки, минимум указанных полей', async function() {
      const response = await options.fastify.inject({
        url: '/order',
        method: 'POST',
        payload: {
          phone: '+38(071)000-00-00',
          address: 'test',
          username: 'test',
          delivery: false,
          products: [
            {
              productId: options.stateId.get('PRODUCT_SINGLE'),
              number: 1
            },
            {
              productId: options.stateId.get('PRODUCT_VARIANT'),
              variantId: options.stateId.get('PRODUCT_VARIANT_1'),
              number: 1
            }
          ]
        }
      })
      expect(response.statusCode).toEqual(201)
    })
  }
}