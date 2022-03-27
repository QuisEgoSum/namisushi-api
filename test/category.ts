import {TestOptions} from './main'


async function expectSizeCategories(options: TestOptions, visible: number, invisible: number) {
  const responseProducts = await options.fastify.inject({url: '/products'})
  expect(responseProducts.statusCode).toEqual(200)
  expect(responseProducts.json().categories.length).toEqual(visible)
  const responseCategories = await options.adminInject({
    url: '/admin/product/categories',
    method: 'GET',
    cookies: {sessionId: options.sessions.admin}
  })
  expect(responseCategories.statusCode).toEqual(200)
  const json = responseCategories.json()
  let nVisible = 0
  let nInvisible = 0
  json.categories.forEach((category: {visible: boolean}) => category.visible ? nVisible++ : nInvisible++)
  expect(nVisible).toEqual(visible)
  expect(nInvisible).toEqual(invisible)
}


export function categoryTests(options: TestOptions) {
  const category = {
    payload: {
      title: 'TEST 1',
      visible: false
    },
    _id: ''
  }
  return function() {
    it('Создание категории', async function() {
      const response = await options.adminInject({
        url: '/admin/product/category',
        method: 'POST',
        payload: category.payload
      })
      expect(response.statusCode).toEqual(201)
      const json = response.json()
      expect(json).toMatchObject({category: category.payload})
      category._id = json.category._id
      await expectSizeCategories(options,0, 1)
    })
    it('Обновление title категории', async function() {
      category.payload.title = 'Test 1'
      const response = await options.adminInject({
        url: `/admin/product/category/${category._id}`,
        method: 'PATCH',
        payload: category.payload
      })
      expect(response.statusCode).toEqual(200)
      expect(response.json()).toMatchObject({category: category.payload})
      await expectSizeCategories(options,0, 1)
    })
    it('Обновление visible категории', async function() {
      category.payload.visible = true
      const response = await options.adminInject({
        url: `/admin/product/category/${category._id}`,
        method: 'PATCH',
        payload: category.payload
      })
      expect(response.statusCode).toEqual(200)
      expect(response.json()).toMatchObject({category: category.payload})
      await expectSizeCategories(options,1, 0)
    })
    it('Удаление категории', async function() {
      const response = await options.adminInject({
        url: `/admin/product/category/${category._id}`,
        method: 'DELETE'
      })
      expect(response.statusCode).toEqual(200)
      await expectSizeCategories(options, 0, 0)
    })
    it('Создание категории', async function() {
      const response = await options.adminInject({
        url: '/admin/product/category',
        method: 'POST',
        payload: category.payload
      })
      expect(response.statusCode).toEqual(201)
      const json = response.json()
      expect(json).toMatchObject({category: category.payload})
      await expectSizeCategories(options,1, 0)
      options.stateId.set('CATEGORY', json._id)
    })
  }
}