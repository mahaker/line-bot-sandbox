export default class Q {
    constructor(
        private no: number,
        private text: string,
        private imageUrl: string,
        private detail: string,
        private answer: boolean) {}

    public getNo(): number {
        return this.no;
    }
    public getText(): string {
        return this.text;
    }
    public getImageUrl(): string {
        return this.imageUrl;
    }
    public getDetail(): string {
        return this.detail;
    }
    public isCorrect(answer: boolean): boolean {
        return this.answer === answer;
    }
}
