

export const STRING = {type: 'string'}
export const STRING_NULLABLE = {type: ['string', 'null']}
export const BOOLEAN = {type: 'boolean'}
export const BOOLEAN_NULLABLE = {type: ['boolean', 'null']}
export const INTEGER = {type: 'integer', }
export const INTEGER_NULLABLE = {type: ['integer', 'null']}


export class ObjectSchema {
  public readonly type = ['object']
  public additionalProperties = false
  constructor(
    public readonly title: string,
    public readonly properties: Record<string, unknown>
  ) {}
}

export class ObjectSchemaRequired extends ObjectSchema {
  public required: string[] = []
  constructor(
    title: string,
    properties: Record<string, unknown>
  ) {
    super(title, properties)
    this.required = Object.keys(this.properties)
  }
}

