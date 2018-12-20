import { Client, PostbackEvent } from '@line/bot-sdk';
import CheckDialog from './CheckDialog';
import CheckListQuestions from './CheckListQuestions';
import CheckListResults from './CheckListResults';
import MessageInnerData from './MessageInnerData';
import FinishDialog from './FinishDialog';

export default class CheckListInterlocutor {
  private readonly questions = new CheckListQuestions();
  private readonly checkListResults = new CheckListResults();

  constructor(private botClient: Client) {}

  public start(userId: string): void {
    this.checkListResults.initilize(userId);
    const nowNumber = this.checkListResults.nowNumber(userId);
    this.displayQuestion(userId, nowNumber);
  }

  public reply(userId: string, event: PostbackEvent) {
    const messageData = MessageInnerData.parse(event.postback.data);
    if (!messageData) return;
    if (!this.checkListResults.existsCheckList(userId)) return;
    const nowNumber = this.checkListResults.nowNumber(userId);
    if (nowNumber !== messageData.questionNumber) return;

    this.checkListResults.recordResult(userId, messageData.checkResult);

    const nextNumber = this.checkListResults.nowNumber(userId);
    if (this.questions.isFinished(nextNumber)) {
      this.diplayFinish(userId);
      return;
    }
    this.displayQuestion(userId, nextNumber);
  }

  private displayQuestion(userId: string, questionNumber: number) {
    const qText = this.questions.get(questionNumber);
    const dialog = new CheckDialog(this.botClient, questionNumber, qText);
    dialog.show(userId);
  }

  private diplayFinish(userId: string) {
    const result = this.checkListResults.goal(userId);
    // TODO おめでとうございます！処理
    console.log('おめでとうございます！チェック終わりました。');
    const dialog = new FinishDialog(this.botClient);
    dialog.show(result);

    // XXX 「記録をどこかに残すようなボット」にするなら、チェックの結果をここで永続化するようにする
  }
}
