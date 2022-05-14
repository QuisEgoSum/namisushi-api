import {BaseRepository} from '@core/repository'
import {Types} from 'mongoose'
import type {ITag} from './TagModel'


export class TagRepository extends BaseRepository<ITag> {
  async updateTag(tagId: string, filename: string, name?: string) {
    const update: Record<string, string> = {icon: filename}
    if (name) {
      update.name = name
    }
    return this.findOneAndUpdate(
      {_id: new Types.ObjectId(tagId)},
      update,
      {new: false}
    )
  }
}