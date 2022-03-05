import {BaseRepository} from '@core/repository/BaseRepository'
import type {UserModel} from './UserModel'
import type {IUser} from './UserModel'


export class UserRepository extends BaseRepository<IUser> {
  constructor(Model: typeof UserModel) {
    super(Model)
  }

  async findByLogin(login: string) {
    return this.findOne(
        {
          $or: [
            {username: login},
            {email: login}
          ]
        },
        {
          _id: 1,
          username: 1,
          email: 1,
          role: 1,
          passwordHash: 1,
          createdAt: 1,
          updatedAt: 1
        }
      )
  }
}