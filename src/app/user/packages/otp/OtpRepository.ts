import {BaseRepository} from '@core/repository'
import {IOtp} from '@app/user/packages/otp/OtpModel'
import {OtpProvider, OtpTarget} from '@app/user/packages/otp/enums'
import {Types} from 'mongoose'


export class OtpRepository extends BaseRepository<IOtp> {
  async findCode(phone: string, code: string, timestamp: number, target: OtpTarget) {
    return this.findOne(
      {
        phone: phone,
        code: code,
        createdAt: {$gte: timestamp},
        target: target
      },
      null,
      {sort: {createdAt: -1}})
  }

  async countGte(timestamp: number, provider: OtpProvider): Promise<number> {
    return this.count({createdAt: {$gte: timestamp}, provider: provider})
  }

  async countGteByPhone(timestamp: number, phone: string, provider: OtpProvider): Promise<number> {
    return this.count({createdAt: {$gte: timestamp}, phone: phone, provider: provider})
  }

  async disablePhoneCodes(phone: string, target: OtpTarget) {
    await this.Model.updateMany(
      {
        phone: phone,
        active: true,
        target: target
      },
      {
        active: false
      }
    )
  }

  async findLastByPhone(phone: string, target: OtpTarget): Promise<IOtp | null> {
    return this.findOne({phone, target}, null, {sort: {createdAt: -1}})
  }

  async markAsUsed(_id: Types.ObjectId) {
    await this.updateById(_id, {used: true, active: false})
  }
}