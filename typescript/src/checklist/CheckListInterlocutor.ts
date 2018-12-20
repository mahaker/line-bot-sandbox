import { Client } from '@line/bot-sdk';
import CheckListResults from './CheckListResults';
import CheckResult from './CheckResult';
import CheckListQuestions from './CheckListQuestions';

export default class CheckListInterlocutor {
  private static readonly RESULT_CHAR: { [key: string]: CheckResult } = {
    '×': CheckResult.Bad,
    '△': CheckResult.Usual,
    '○': CheckResult.Good
  };

  private readonly questions = new CheckListQuestions();
  private readonly checkListResults = new CheckListResults();

  constructor(private botClient: Client) {}

  public start(userId: string): void {
    this.checkListResults.initilize(userId);
    const nowNumber = this.checkListResults.nowNumber(userId);
    console.log(`ここで、${nowNumber} 問目を出す`);
  }

  public reply(userId: string, resultText: string) {
    const result = CheckListInterlocutor.RESULT_CHAR[resultText];
    if (!result) {
      return;
    }
    if (!this.checkListResults.existsCheckList(userId)) {
      return;
    }
    this.checkListResults.recordResult(userId, result);
    const nowNumber = this.checkListResults.nowNumber(userId);
    if (this.questions.isFinished(nowNumber)) {
      this.checkListResults.goal(userId);
      // TODO おめでとうございます！処理
      console.log('おめでとうございます！チェック終わりました。');
      return;
    }
    // TODO 次の問題表示処理
    const qText = this.questions.get(nowNumber);
    console.log(`${nowNumber} 問目 : ${qText}`);
  }
}
