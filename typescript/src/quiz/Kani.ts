import Quiz from './Quiz';
import Provider from './Provider';

export default class Kani implements Provider {
    type: string = 'かに'; // リッチメニューのテキスト（押下すると投稿される文字列）に合わせる必要がある。
    private index: number = 0;
    private readonly quizzes: Quiz[] = [
        new Quiz(1, '越前がには一年中とってよい', false),
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