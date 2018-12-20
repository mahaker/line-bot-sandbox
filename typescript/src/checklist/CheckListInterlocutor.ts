import { Client } from '@line/bot-sdk';
import CheckDialog from './CheckDialog';
import CheckListQuestions from './CheckListQuestions';
import CheckListResults from './CheckListResults';

export default class CheckListInterlocutor {
  private readonly questions = new CheckListQuestions();
  private readonly checkListResults = new CheckListResults();

  constructor(private botClient: Client) {}

  public start(userId: string): void {
    this.checkListResults.initilize(userId);
    const nowNumber = this.checkListResults.nowNumber(userId);
    this.displayQuestion(userId, nowNumber);
  }

  public reply(userId: string, resultText: string) {
    const result = CheckDialog.RESULT_CHAR[resultText];
    if (!result) return;
    if (!this.checkListResults.existsCheckList(userId)) return;

    this.checkListResults.recordResult(userId, result);

    const nowNumber = this.checkListResults.nowNumber(userId);
    if (this.questions.isFinished(nowNumber)) {
      this.diplayFinish(userId);
      return;
    }
    this.displayQuestion(userId, nowNumber);
  }

  private displayQuestion(userId: string, questionNumber: number) {
    const qText = this.questions.get(questionNumber);
    const dialog = new CheckDialog(this.botClient, questionNumber, qText);
    dialog.show(userId);
  }

  private diplayFinish(userId: string) {
    this.checkListResults.goal(userId);
    // TODO おめでとうございます！処理
    console.log('おめでとうございます！チェック終わりました。');
    // XXX 「記録をどこかに残すようなボット」にするなら、チェックの結果をここで永続化するようにする
  }
}
