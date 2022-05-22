import {BaseRepository} from '@core/repository'
import {IOtp} from '@app/user/packages/otp/OtpModel'
import {OtpTarget} from '@app/user/packages/otp/OtpTarget'


export class OtpRepository extends BaseRepository<IOtp> {
  async isExists(phone: string, code: string, target: OtpTarget) {
    return await this.findOne({phone, code, target}, {_id: 1})
  }

  async deleteOtp(phone: string, code: string, target: OtpTarget) {
    return await this.deleteOne({phone, code, target})
  }

  async findLastCreatedAt(phone: string, target: OtpTarget.SIGN_IN) {
    return this.findOne({phone, target}, {createdAt: 1}, {sort: {createdAt: -1}})
  }
}