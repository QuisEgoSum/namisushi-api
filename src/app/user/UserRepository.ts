import {BaseRepository} from '@core/repository/BaseRepository'
import {UserRole} from '@app/user/UserRole'
import type {IUser} from '@app/user/UserModel'
import {v4} from 'uuid'
import {Types} from 'mongoose'


export class UserRepository extends BaseRepository<IUser> {
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
}