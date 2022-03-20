

export function nullable(schema: Record<string, any>) {
  const type = ['null']
  if (Array.isArray(schema.type)) {
    type.push(...schema.type)
  } else {
    type.push(schema.type)
  }
  return {
    ...schema,
    type
  }
}