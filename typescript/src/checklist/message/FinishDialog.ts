import { Client } from '@line/bot-sdk';
import CheckListResult from '../domain/CheckListResult';
import PlainMessage from './PlainMessage';
import CheckResult from '../domain/CheckResult';

export default class FinishDialog {
  constructor(private botClient: Client) {}

  public async show(checkListResult: CheckListResult) {
    const content = this.createContent(checkListResult);
    const message = new PlainMessage(this.botClient);
    await message.show(checkListResult.userId, content);
  }

  private createContent(checkListResult: CheckListResult): string {
    let content = 'これでチェックはすべて終了です。お疲れ様でした！\n';
    content += '結果は\n';
    content += this.makeCountParts(checkListResult);
    content += '\nでした。';
    return content;
  }

  private makeCountParts(checkListResult: CheckListResult): string {
    const resTexts: string[] = [];
    for (const item in CheckResult) {
      const resultType = item as CheckResult;
      const caption = CheckResult[item] as string;
      const count = checkListResult.countOf(resultType);
      const part = `${caption}:${count}`;
      resTexts.push(part);
    }
    const counts = resTexts.join(', ');
    const point = checkListResult.calculatePoint();
    const maxPoint = checkListResult.maxPoint();
    return counts + `, 健全度:${point}P(最大:${maxPoint}P)`;
  }
}
