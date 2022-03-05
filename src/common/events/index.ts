import {EventEmitter} from 'events'
import {logger} from '@logger'


export class Events extends EventEmitter {
  private safeListeners: Map<(...args: any[]) => void, (...args: any[]) => void>
  constructor() {
    super()
    this.safeListeners = new Map()
  }

  safeOn(eventName: string | symbol, listener: (...args: any[]) => void): this {
    const log = logger.child({label: 'events', event: eventName, class: this.constructor.name})
    const handler = async (...params: any[]) => {
      try {
        await listener(...params)
      } catch (error) {
        log.error(error)
      }
    }
    this.safeListeners.set(listener, handler)
    return super.on(eventName, handler)
  }
}