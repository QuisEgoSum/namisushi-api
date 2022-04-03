import {BaseRepository} from '@core/repository'
import {IOtp} from '@app/user/packages/otp/OtpModel'
import {OtpTarget} from '@app/user/packages/otp/OtpTarget'


export class OtpRepository extends BaseRepository<IOtp> {
  async isExists(phone: string, code: string, target: OtpTarget) {
    return await this.findOne({phone, code, target}, {_id: 1})
  }

  async isExistsAndDelete(phone: string, code: string, target: OtpTarget) {
    return await this.findOneAndDelete({phone, code, target}, {projection: {_id: 1}})
  }
}