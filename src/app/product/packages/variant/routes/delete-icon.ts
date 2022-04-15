import {FastifyInstance} from 'fastify'
import {VariantService} from '@app/product/packages/variant/VariantService'
import {DocsTags} from '@app/docs'
import {MessageResponse, NotFound} from '@common/schemas/response'
import {VariantIconDoesNotExistError} from '@app/product/packages/variant/variant-error'


interface DeleteIconRequest {
  Params: {
    filename: string
  }
}


export async function deleteIcon(fastify: FastifyInstance, service: VariantService) {
  return fastify
    .route<DeleteIconRequest>(
      {
        url: '/admin/product/variant/icon/:filename',
        method: 'DELETE',
        schema: {
          summary: 'Удалить иконку варианта продукта',
          tags: [DocsTags.VARIANT_ADMIN],
          params: {
            filename: {type: 'string'}
          },
          response: {
            [200]: new MessageResponse('Иконка удалена'),
            [404]: new NotFound(VariantIconDoesNotExistError.schema())
          }
        },
        security: {
          auth: true,
          admin: true
        },
        handler: async function(request, reply) {
          await service.deleteIcon(request.params.filename)

          reply
            .code(200)
            .type('application/json')
            .send({message: 'Иконка удалена'})
        }
      }
    )
}