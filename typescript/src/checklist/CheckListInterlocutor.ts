import { Client, PostbackEvent } from '@line/bot-sdk';
import CheckDialog from './message/CheckDialog';
import CheckListQuestions from './domain/CheckListQuestions';
import CheckListResults from './domain/CheckListResults';
import MessageInnerData from './message/MessageInnerData';
import FinishDialog from './message/FinishDialog';
import PlainMessage from './message/PlainMessage';

export default class CheckListInterlocutor {
  private readonly questions = new CheckListQuestions();
  private readonly results = new CheckListResults();

  constructor(private botClient: Client) {}

  public start(userId: string): void {
    this.results.initilize(userId);
    const nowNumber = this.results.nowNumber(userId);
    this.displayStart(userId);
    this.displayQuestion(userId, nowNumber);
  }

  public reply(userId: string, event: PostbackEvent) {
    const messageData = MessageInnerData.parse(event.postback.data);
    if (!messageData) return;
    if (!this.results.existsCheckList(userId)) return;
    const nowNumber = this.results.nowNumber(userId);
    if (nowNumber !== messageData.questionNumber) return;

    this.results.recordResult(userId, messageData.checkResult);

    const nextNumber = this.results.nowNumber(userId);
    if (this.questions.isFinished(nextNumber)) {
      this.diplayFinish(userId);
      return;
    }
    this.displayQuestion(userId, nextNumber);
  }

  private displayStart(userId: string): any {
    const qCount = this.questions.count();
    let content = `これから「生活習慣チェック」を始めます。(チェック項目:${qCount})\n`;
    content += 'チェック項目の下のボタンを押して、項目を進めてください。';
    const message = new PlainMessage(this.botClient);
    message.show(userId, content);
  }

  private displayQuestion(userId: string, questionNumber: number) {
    const qText = this.questions.get(questionNumber);
    const dialog = new CheckDialog(this.botClient, questionNumber, qText);
    dialog.show(userId);
  }

  private diplayFinish(userId: string) {
    const result = this.results.goal(userId);
    const dialog = new FinishDialog(this.botClient);
    dialog.show(result);
    // XXX 「記録をどこかに残すようなボット」にするなら、チェックの結果をここで永続化するようにする
  }
}
