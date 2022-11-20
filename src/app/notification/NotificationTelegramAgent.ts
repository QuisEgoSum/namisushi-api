import type {UserService} from '@app/user/UserService'
import type {ExtraReplyMessage} from 'telegraf/typings/telegram-types'
import {Telegram} from '../../server/telegram/Telegram'


export class NotificationTelegramAgent {
  constructor(
    private readonly telegram: Telegram,
    private readonly userService: UserService
  ) {}

  private async sendMessages(
    ids: number[],
    messages: string[],
    options: ExtraReplyMessage = {parse_mode: 'Markdown'}
  ) {
    return await this.telegram.sendMessage(ids, messages, options)
  }

  public async sendAdminMessage(
    messages: string[],
    options: ExtraReplyMessage
  ) {
    const recipientIds = this.userService.getTelegramAdminIds()
    return await this.sendMessages(recipientIds, messages, options)
  }

  public async sendWatcherMessage(messages: string[]) {
    const recipientIds = this.userService.getTelegramWatcherIds()
    await this.sendMessages(recipientIds, messages)
  }
}