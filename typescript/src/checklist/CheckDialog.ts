import { Client } from '@line/bot-sdk';
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

  public show(userId: string) {
    console.log(`${this.questionNumber} 問目 : ${this.questionText}`);
  }
}
