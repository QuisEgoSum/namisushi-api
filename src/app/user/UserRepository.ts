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
          username: 1,
          name: 1,
          email: 1,
          phone: 1,
          role: 1,
          avatar: 1,
          passwordHash: 1,
          createdAt: 1,
          updatedAt: 1
        }
      )
  }

  distinctAdminTelegramIds(): Promise<number[]> {
    return this.Model
      .distinct(
        'telegramId',
        {telegramId: {$ne: null}, role: {$in: [UserRole.ADMIN, UserRole.WATCHER]}}
      ) as unknown as Promise<number[]>
  }


  distinctWatcherTelegramIds() {
    return this.Model
      .distinct(
        'telegramId',
        {telegramId: {$ne: null}, role: UserRole.WATCHER}
      ) as unknown as Promise<number[]>
  }

  async upsertCustomerByPhone(phone: string, name: string): Promise<IUser> {
    return await this.findOneAndUpdate(
      {phone},
      {$setOnInsert: {name}},
      {new: true, upsert: true}
    ) as unknown as Promise<IUser> //upsert
  }

  findRoleByPhone(phone: string) {
    return this.findOne({phone}, {role: 1})
  }
}