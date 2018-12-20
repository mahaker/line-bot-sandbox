import { Client } from '@line/bot-sdk';
import CheckListQuestions from './CheckListQuestions';
import CheckListResults from './CheckListResults';
import CheckResult from './CheckResult';

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
    this.displayQuestion(nowNumber);
  }

  public reply(userId: string, resultText: string) {
    const result = CheckListInterlocutor.RESULT_CHAR[resultText];
    if (!result) return;
    if (!this.checkListResults.existsCheckList(userId)) return;
    this.checkListResults.recordResult(userId, result);
    const nowNumber = this.checkListResults.nowNumber(userId);
    if (this.questions.isFinished(nowNumber)) {
      this.checkListResults.goal(userId);
      // TODO おめでとうございます！処理
      console.log('おめでとうございます！チェック終わりました。');
      // XXX 「記録をどこかに残すようなボット」にするなら、チェックの結果をここで永続化するようにする
      return;
    }
    this.displayQuestion(nowNumber);
  }

  private displayQuestion(questionNumber: number) {
    // TODO ちゃんとダイアログにする。
    const qText = this.questions.get(questionNumber);
    console.log(`${questionNumber} 問目 : ${qText}`);
  }
}
