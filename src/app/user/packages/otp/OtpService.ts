import {BaseService} from '@core/service'
import {IOtp} from '@app/user/packages/otp/OtpModel'
import {OtpRepository} from '@app/user/packages/otp/OtpRepository'
import * as error from './otp-error'
import {GreenSMSProvider} from '@app/user/packages/otp/GreenSMSProvider'
import {config} from '@config'
import {OtpProvider, OtpTarget} from '@app/user/packages/otp/enums'


export class OtpService extends BaseService<IOtp, OtpRepository, typeof error> {

  private static DAY_MS = 86400000
  private static SEND_OTP_TIMEOUT_SEC = 60

  constructor(
    repository: OtpRepository,
    private readonly greenSMSProvider: GreenSMSProvider
  ) {
    super(repository, error)
    this.error = {...this.error, ...error}
    this.error.EntityDoesNotExistError = this.error.OtpCodeDoesNotExistError
  }

  private formatPhone(phone: string): string {
    return phone
      .replace(/\D/g, '')
  }

  async verifyCode(phone: string, code: string): Promise<void> {
    phone = this.formatPhone(phone)
    const timestamp = Date.now() - OtpService.DAY_MS
    const otp = await this.repository.findCode(phone, code, timestamp, OtpTarget.SIGN_IN)
    if (!otp) throw new this.error.OtpCodeDoesNotExistError()
    if (otp.used) throw new this.error.OtpCodeHasAlreadyBeenUsedError()
    if (!otp.active || Date.now() - otp.createdAt > Date.now() - otp.createdAt) throw new this.error.OtpCodeHasExpiredError()
    await this.repository.markAsUsed(otp._id)
  }

  async callOtpCode(phone: string): Promise<string> {
    phone = this.formatPhone(phone)
    const timestamp = Date.now() - OtpService.DAY_MS
    const totalCount = await this.repository.countGte(timestamp, OtpProvider.GREEN_SMS)
    if (totalCount > config.user.otp.providers.greenSMS.dayLimits.total) {
      throw new this.error.SendOtpDayLimitError()
    }
    const phoneCount = await this.repository.countGteByPhone(timestamp, phone, OtpProvider.GREEN_SMS)
    if (phoneCount > config.user.otp.providers.greenSMS.dayLimits.phone) {
      throw new this.error.SendOtpPhoneDayLimitError()
    }
    const lastOtp = await this.repository.findLastByPhone(phone, OtpTarget.SIGN_IN)
    const sendDif = lastOtp && Math.ceil((Date.now() - lastOtp.createdAt) / 1000)
    if (sendDif && sendDif < OtpService.SEND_OTP_TIMEOUT_SEC) {
      throw new this.error.SendOtpTimeoutError({
        message: `Интервал между отправкой сообщений должен быть 60 секунд. Подождите ещё ${
          OtpService.SEND_OTP_TIMEOUT_SEC - sendDif || 1
        }`
      })
    }
    await this.repository.disablePhoneCodes(phone, OtpTarget.SIGN_IN)
    const code = await this.greenSMSProvider.callOtpCode(phone)
    await this.repository.create({
      phone: phone,
      code: code,
      target: OtpTarget.SIGN_IN,
      provider: OtpProvider.GREEN_SMS,
      active: true,
      used: false
    })
    return code
  }
}