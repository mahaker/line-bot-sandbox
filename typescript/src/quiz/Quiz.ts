export interface Detail {
    text: string;
    uri: string;
}

export interface Column {
    thumbnailImageUrl: string;
    title: string;
    text: string;
    details: Detail[];
}

export default class Q {
    constructor(
        private no: number,
        private text: string,
        private imageUrl: string,
        private columns: Column[],
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
    public getColumns(): Column[] {
        return this.columns;
    }
    public isCorrect(answer: boolean): boolean {
        return this.answer === answer;
    }
}
