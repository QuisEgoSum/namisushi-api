import {fastify} from 'fastify'
import fastifySwagger from 'fastify-swagger'
import fastifyCors from 'fastify-cors'
import fastifyHelmet from 'fastify-helmet'
import fastifyStatic from 'fastify-static'
import fastifyCookie from 'fastify-cookie'
import fastifyMultipart from '@fastify/multipart'
import {config} from '@config'
import {httpLogger} from './modules/logger'
import {errorHandler} from './modules/error-handler'
import {notFoundHandler} from './modules/not-found-handler'
import {schemaErrorFormatter, ajv} from '@core/validation'
import {createSecurityHook, CreateSecurityHookOptions} from './modules/security'
import {createDocsHook} from './modules/docs'
import {createMultipartHook} from './modules/multipart'
import {customHooks} from './modules/custom-hooks'
import type {FastifyInstance} from 'fastify'


export interface CreateHttpServerOptions {
  routers: Array<(fastify: FastifyInstance) => Promise<any>>,
  server?: FastifyInstance,
  swagger: any,
  securityOptions: CreateSecurityHookOptions
}

export function createHttpServer(options: CreateHttpServerOptions) {
  const fastifyInstance: FastifyInstance = options.server || fastify({
    trustProxy: true,
    logger: httpLogger,
    bodyLimit: 10737418240
  })
    .addHook('onRoute', createSecurityHook(options.securityOptions))
    .addHook('onRoute', createDocsHook())
    .addHook('onRoute', createMultipartHook())
    .addHook('onRoute', customHooks)
    .setErrorHandler(errorHandler)
    .setNotFoundHandler(notFoundHandler)
    // @ts-ignore
    .setValidatorCompiler(({schema}) => ajv.compile(schema))
    .setSchemaErrorFormatter(schemaErrorFormatter)
    .register(fastifyMultipart, {attachFieldsToBody: true})
    .register(fastifyCors, {
      allowedHeaders: config.server.cors.allowedHeaders,
      origin: config.server.cors.allowedOrigins,
      methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH']
    })
    .register(fastifyHelmet, {
      contentSecurityPolicy: config.server.csp
    })
    .register(fastifyCookie)
    .register(fastifySwagger, options.swagger)
    .register(fastifyStatic, {root: config.paths.shareStatic})


  options.routers.forEach(router => fastifyInstance.register(router))

  return fastifyInstance
}