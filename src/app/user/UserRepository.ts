import {BaseRepository} from '@core/repository/BaseRepository'
import {UserRole} from '@app/user/UserRole'
import type {IUser} from '@app/user/UserModel'


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
}