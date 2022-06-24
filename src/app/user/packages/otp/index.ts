import {OtpModel} from '@app/user/packages/otp/OtpModel'
import {OtpRepository} from '@app/user/packages/otp/OtpRepository'
import {OtpService} from '@app/user/packages/otp/OtpService'
import {OtpTarget} from './enums'
import {GreenSMSProvider} from '@app/user/packages/otp/GreenSMSProvider'


class Otp {
  constructor(
    public readonly service: OtpService
  ) {}
}


export async function initOtp() {
  const greenSMSProvider = new GreenSMSProvider()
  const service = new OtpService(new OtpRepository(OtpModel), greenSMSProvider)
  return new Otp(service)
}


export type {
  Otp,
  OtpService
}


export {
  OtpTarget
}