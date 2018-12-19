export default class Q {
    constructor(private no: number, private text: string, private answer: boolean) {}

    getNo(): number {
        return this.no;
    }
    getText(): string {
        return this.text;
    }
    isCorrect(answer: boolean): boolean {
        return this.answer === answer;
    }
}
