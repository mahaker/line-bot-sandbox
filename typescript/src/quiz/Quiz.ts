export interface Detail {
    text: string;
    uri: string;
}

export default class Q {
    constructor(
        private no: number,
        private text: string,
        private imageUrl: string,
        private details: Detail[],
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
    public getDetails(): Detail[] {
        return this.details;
    }
    public isCorrect(answer: boolean): boolean {
        return this.answer === answer;
    }
}
