export default class Q {
    constructor(private no: number, private text: string, private answer: boolean) {}

    getNo(): number {
        return this.no;
    }
    getText(): string {
        return this.text;
    }
    getAnswer(): boolean {
        return this.answer;
    }
    isCorrect(no: number, answer: boolean): boolean {
        return this.no === no && this.answer === answer;
    }
}

export interface QType {
    type: string;
}
