import {OtpService} from '@app/user/packages/otp/OtpService'
import {OtpRepository} from '@app/user/packages/otp/OtpRepository'
import {OtpModel} from '@app/user/packages/otp/OtpModel'
import {OtpTarget} from './OtpTarget'


class Otp {
  constructor(
    public readonly service: OtpService
  ) {}
}


export async function initOtp() {
  const service = new OtpService(new OtpRepository(OtpModel))
  return new Otp(service)
}

export type {
  Otp
}

export {
  OtpTarget
}