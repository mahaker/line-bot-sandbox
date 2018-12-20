import { Client, TemplateMessage } from '@line/bot-sdk';
import CheckResult from './CheckResult';

export default class CheckDialog {
  public static readonly RESULT_CHAR: { [key: string]: CheckResult } = {
    '×': CheckResult.Bad,
    '△': CheckResult.Usual,
    '○': CheckResult.Good
  };

  constructor(
    private botClient: Client,
    private questionNumber: number,
    private questionText: string
  ) {}

  public async show(userId: string) {
    console.log(`${this.questionNumber} 問目 : ${this.questionText}`);
    // tslint:disable-next-line:object-literal-sort-keys
    const message: TemplateMessage = {
      altText: 'This is a buttons template',
      template: {
        actions: [
          { type: 'postback', label: 'Buy', data: 'action=buy&itemid=123' },
          {
            data: 'action=add&itemid=123',
            label: 'Add to cart',
            type: 'postback'
          },
          {
            label: 'View detail',
            type: 'uri',
            uri: 'http://example.com/page/123'
          }
        ],
        defaultAction: {
          label: 'View detail',
          type: 'uri',
          uri: 'http://example.com/page/123'
        },
        imageAspectRatio: 'rectangle',
        imageBackgroundColor: '#FFFFFF',
        imageSize: 'cover',
        text: 'Please select',
        thumbnailImageUrl: 'https://example.com/bot/images/image.jpg',
        title: 'Menu',
        type: 'buttons'
      },
      type: 'template'
    };
    await this.botClient.pushMessage(userId, message);
  }
}
