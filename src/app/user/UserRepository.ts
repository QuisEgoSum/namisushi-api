import {BaseRepository} from '@core/repository/BaseRepository'
import type {IUser, UserModel} from './UserModel'
import {UserRole} from '@app/user/UserRole'


export class UserRepository extends BaseRepository<IUser> {
  constructor(Model: typeof UserModel) {
    super(Model)
  }

  async findByLogin(login: string) {
    return this.findOne(
        {
          $or: [
            {username: login},
            {email: login},
            {phone: login}
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

  distinctAdminTelegramIds(): Promise<number[]> {
    return this.Model.distinct('telegramId', {role: {$ne: UserRole.USER}}) as unknown as Promise<number[]>
  }
}