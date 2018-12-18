import Quiz from './Quiz';
import Provider from './Provider';

export default class Matsunami implements Provider {
    type: string = 'まつなみ'; // リッチメニューのテキスト（押下すると投稿される文字列）に合わせる必要がある。
    private index: number = 0;
    private readonly quizzes: Quiz[] = [
        new Quiz(1, 'まつなみの誕生日は12月18日である。', false),
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
