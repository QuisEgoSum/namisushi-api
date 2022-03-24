import {createTelegramBot} from './server'
import type {Telegraf} from 'telegraf'


export type TelegramBot = Telegraf | null


export {
  createTelegramBot
}