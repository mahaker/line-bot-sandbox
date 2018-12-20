import { Action, Client, PostbackAction, TemplateMessage } from '@line/bot-sdk';
import CheckResult from '../domain/CheckResult';
import MessageInnerData from './MessageInnerData';

export default class CheckDialog {
  constructor(
    private botClient: Client,
    private questionNumber: number,
    private questionText: string
  ) {}

  public async show(userId: string) {
    console.log(`${this.questionNumber} 問目 : ${this.questionText}`);
    const buttons = this.createButtuns(this.questionNumber);
    const message: TemplateMessage = {
      altText: 'This is a buttons template',
      template: {
        actions: buttons,
        text: this.questionText,
        title: `生活習慣チェックリスト その${this.questionNumber}`,
        type: 'buttons'
      },
      type: 'template'
    };
    await this.botClient.pushMessage(userId, message);
  }

  private createButtuns(questionNumber: number): Action[] {
    const actions: Action[] = [];
    for (const item in CheckResult) {
      const data = new MessageInnerData(questionNumber, item as CheckResult);
      const caption = CheckResult[item] as string;
      console.log('data.serialize():' + data.serialize());
      const buttun = {
        data: data.serialize(),
        label: caption,
        type: 'postback'
      };
      actions.push(buttun as Action);
    }
    return actions;
  }
}
