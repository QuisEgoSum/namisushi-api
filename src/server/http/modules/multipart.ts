import {FastifyRequest, RouteOptions} from 'fastify'


export function createMultipartHook() {
  async function attachFiles(request: FastifyRequest) {
    if (!request.isMultipart()) {
      return
    }
    if (!request.body) {
      request.body = {}
    } else {
      // @ts-ignore
      for (const [key, value] of Object.entries(request.body)) {
        if (Array.isArray(value)) {
          continue
        }
        // @ts-ignore
        if (!value.file) {
          // @ts-ignore
          request.body[key] = value.value
        } else {
          // @ts-ignore
          request.body[key] = [value]
        }
      }
    }
  }

  return function multipartHook(router: RouteOptions) {
    if (!router.schema?.consumes?.includes('multipart/form-data')) {
      return
    }
    if (!router.preValidation) {
      router.preValidation = []
    } else if (typeof router.preValidation === 'function') {
      router.preValidation = [router.preValidation]
    }
    router.preValidation.unshift(attachFiles)
  }
}