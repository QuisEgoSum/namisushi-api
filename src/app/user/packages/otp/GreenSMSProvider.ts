import GreenSMS from 'greensms'
import {config} from '@config'
import {logger} from '@logger'


export class GreenSMSProvider {
  private greenSMS: GreenSMS<true>
  private logger: typeof logger

  constructor() {
    this.greenSMS = new GreenSMS({token: config.user.otp.providers.greenSMS.token, camelCaseResponse: true})
    this.logger = logger.child({label: 'GreenSMSProvider'})
  }

  async callOtpCode(phone: string): Promise<string> {
    if (config.user.otp.providers.greenSMS.testMode) {
      return "0000"
    }
    const response = await this.greenSMS.call.send({to: phone})
    this.logger.info(`Send code ${response.code} to phone ${phone}. ${response.requestStatus} ${response.requestId}`)
    return response.code
  }
}