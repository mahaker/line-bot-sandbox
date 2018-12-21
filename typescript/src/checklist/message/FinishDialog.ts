import { Client } from '@line/bot-sdk';
import CheckListQuestions from '../domain/CheckListQuestions';
import CheckListResult from '../domain/CheckListResult';
import CheckResult from '../domain/CheckResult';
import PlainMessage from './PlainMessage';

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
        content += '\nでした。\n';
        content += this.makeEvaluationOfHelth(checkListResult);
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
        return counts + `, ええかんじ度:${point}P(最大:${maxPoint}P)`;
    }

    private makeEvaluationOfHelth(checkListResult: CheckListResult): string {
        const minPoint = new CheckListQuestions().count();
        const point = checkListResult.calculatePoint();
        if (point === checkListResult.maxPoint())
            return '素晴らしい！完璧な生活習慣です。';
        if (point > minPoint * 2)
            return 'かなり良い生活週間です。この調子で維持しましょう！';
        if (point > minPoint)
            return '平均的な生活習慣です。まだ改善できそうですね！';
        return 'めっちゃヤベーヤツです！是非、生活習慣の改善を！';
    }
}
