import Quiz from './Quiz';
import Provider from './Provider';

export default class Tojinbou implements Provider {
    type: string = '東尋坊'; // リッチメニューのテキスト（押下すると投稿される文字列）に合わせる必要がある。
    private index: number = 0;
    private readonly quizzes: Quiz[] = [
        new Quiz(1, '「東尋坊」はお坊さんの名前が由来になっている', true),
    ];

    getQuizByNo(no: number): Quiz | undefined {
        return this.quizzes.find(q => q.getNo() === no);
    }

    hasNext(): boolean {
        return this.quizzes.length - 1 === this.index;
    }

    next(): Quiz {
        return this.quizzes[this.index];
    }
}

