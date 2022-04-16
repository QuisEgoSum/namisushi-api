import type {UserService} from '@app/user/UserService'
import type {Telegraf} from 'telegraf'
import type {ExtraReplyMessage} from 'telegraf/typings/telegram-types'


export class NotificationTelegramAgent {
  constructor(
    private readonly bot: Telegraf,
    private readonly userService: UserService
  ) {}

  private async sendMessages(ids: number[], messages: string[], options: ExtraReplyMessage = {parse_mode: 'Markdown'}) {
    await Promise.all(ids.map(id => messages.map(message => this.bot.telegram.sendMessage(id, message, options))).flat())
  }

  public async sendAdminMessage(messages: string[]) {
    const recipientIds = await this.userService.distinctAdminTelegramIds()
    await this.sendMessages(recipientIds, messages)
  }

  public async sendWatcherMessage(messages: string[]) {
    const recipientIds = await this.userService.distinctWatcherTelegramIds()
    await this.sendMessages(recipientIds, messages)
  }
}