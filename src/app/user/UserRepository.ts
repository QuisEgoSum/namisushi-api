import {BaseRepository} from '@core/repository/BaseRepository'
import {UserRole} from '@app/user/UserRole'
import {v4} from 'uuid'
import type {IUser} from '@app/user/UserModel'


export class UserRepository extends BaseRepository<IUser> {
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

  distinctTelegramIdsByRoles(...roles: UserRole[]): Promise<number[]> {
    return this.Model
      .distinct(
        'telegramId',
        {telegramId: {$ne: null}, role: {$in: roles}}
      )
      .exec()
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

  async upsertUser(user: Partial<IUser>) {
    return await this.findOneAndUpdate(
      {phone: user.phone},
      {
        $set: user,
        $setOnInsert: {
          avatar: `#=${v4()}`,
          telegramId: null
        }
      },
      {upsert: true, new: true}
    )
  }
}