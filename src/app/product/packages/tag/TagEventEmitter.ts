import {EventEmitter} from 'events'
import {Types} from 'mongoose'


export enum TagEvents {
  DELETE_TAG = 'DELETE_TAG'
}


export interface ITagEventEmitter {
  emit(event: TagEvents.DELETE_TAG, tagId: Types.ObjectId): boolean
  on(event: TagEvents.DELETE_TAG, listener: (tagId: Types.ObjectId) => Promise<void>): this
}


export class TagEventEmitter extends EventEmitter implements ITagEventEmitter {}