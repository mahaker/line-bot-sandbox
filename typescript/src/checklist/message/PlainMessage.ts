import { Client, TextMessage } from '@line/bot-sdk';

export default class PlainMessage {
  constructor(private botClient: Client) {}

  public async show(userId: string, text: string) {
    const message: TextMessage = { type: 'text', text: text };
    await this.botClient.pushMessage(userId, message);
  }
}
