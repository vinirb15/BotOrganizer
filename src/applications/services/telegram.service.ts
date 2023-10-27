import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';

@Injectable()
export class TelegramService {
  private bot: Telegraf;

  constructor() {
    // Initialize the bot with your bot token
    this.bot = new Telegraf(process.env.BOT_TOKEN);
  }

  async sendMessage(chatId: number, message: string): Promise<void> {
    try {
      // Send a message to the specified chat ID
      await this.bot.telegram.sendMessage(chatId, message);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
}
