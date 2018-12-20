import Quiz from './Quiz';

export default interface Provider {
    getQuizByNo: (no: number) => Quiz | undefined;
    init: () => Quiz;
    current: () => Quiz;
    hasNext: () => boolean;
    next: () => Quiz;
}
