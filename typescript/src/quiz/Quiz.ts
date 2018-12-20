export default class Q {
    constructor(
        private no: number,
        private text: string,
        private imageUrl: string,
        private detail: string,
        private answer: boolean) {}

    getNo(): number {
        return this.no;
    }
    getText(): string {
        return this.text;
    }
    getImageUrl(): string {
        return this.imageUrl;
    }
    getDetail(): string {
        return this.detail;
    }
    isCorrect(answer: boolean): boolean {
        return this.answer === answer;
    }
}
