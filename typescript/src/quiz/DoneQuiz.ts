import Quiz from './Quiz';

export default class DoneQuiz {
    private doneQuiz: Quiz[] = [];

    public add(q: Quiz) {
        this.doneQuiz.push(q);
    }

    public init() {
        this.doneQuiz = [];
    }

    public isDone(q: Quiz): boolean {
        return this.doneQuiz.find(done => {
            return done.getNo() === q.getNo();
        }) !== undefined;
    }
}