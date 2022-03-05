import type {MongoServerError} from 'mongodb'


export class BaseRepositoryError extends Error {
  constructor() {
    super()
  }

  static UniqueKeyError = class UniqueKeyError extends BaseRepositoryError {
    static fromMongooseError(error: MongoServerError) {
      const key = Object.keys(error.keyPattern)[0]
      const value = error.keyValue[key]
      return new UniqueKeyError({
        message: `The value ${JSON.stringify(value)} of the key "${key}" is not unique`,
        code: 11000,
        key: key,
        value: value,
        name: 'UniqueKeyError',
        stack: error.stack
      })
    }

    message: string
    code = 1
    key: string
    value: string

    constructor(error: UniqueKeyError) {
      super()
      this.message = error.message
      this.code = error.code
      this.key = error.key
      this.value = error.value
      this.stack = error.stack
    }
  }
}