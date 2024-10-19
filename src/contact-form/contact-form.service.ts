import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as TelegramBot from 'node-telegram-bot-api';
import { ContactFormInput } from './inputs/contact-form.input';

@Injectable()
export class ContactFormService {
  private readonly bot: TelegramBot;

  constructor(private readonly configService: ConfigService) {
    this.bot = new TelegramBot(configService.get('CONTACT_BOT_TOKEN'));
  }

  async createMessage(input: ContactFormInput): Promise<boolean> {
    const email = `Email sent: ${input.email} \n`;
    const name = `Name: ${input.name} \n`;
    const message = `Message: ${input.msg} \n`;
    await this.bot.sendMessage(
      this.configService.get('CONTACT_CHAT_ID'),
      email + name + message,
    );
    return true;
  }
}
