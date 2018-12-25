export default class Point {

    private point!: number;

    get(): number {
        return this.point;
    }
    increment() {
        this.point++;
    }
}