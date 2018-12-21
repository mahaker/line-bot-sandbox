import { Client, TextMessage } from '@line/bot-sdk';

export default class PlainMessage {
    constructor(private botClient: Client) {}

    public async show(userId: string, messageText: string) {
        const message: TextMessage = { type: 'text', text: messageText };
        await this.botClient.pushMessage(userId, message);
    }
}
