import Quiz from './Quiz';

export default interface Provider {
    getQuizByNo: (no: number) => Quiz | undefined;
    init: () => Quiz;
    hasNext: () => boolean;
    next: () => Quiz;
}