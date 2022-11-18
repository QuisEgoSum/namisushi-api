import {BaseRepository} from '@core/repository/BaseRepository'
import {UserRole} from '@app/user/UserRole'
import type {IUser} from '@app/user/UserModel'
import {Types} from 'mongoose'


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
      {new: true, upsert: true, projection: {_id: 1, name: 1}}
    ) as unknown as Promise<IUser> //upsert
  }

  /**
   * @deprecated
   */
  findRoleByPhone(phone: string) {
    return this.findOne({phone}, {role: 1})
  }

  async upsertUser(phone: string, setOnInsert: Partial<IUser>): Promise<IUser> {
    return await this.findOneAndUpdate(
      {phone: phone},
      {$setOnInsert: setOnInsert},
      {new: true, upsert: true}
    ) as unknown as IUser
  }

  async setUserRole(id: Types.ObjectId, role: UserRole) {
    await this.updateById(id, {role})
  }

  async setAvatar(userId: Types.ObjectId, filename: string) {
    await this.updateById(userId, {avatar: filename})
  }
}