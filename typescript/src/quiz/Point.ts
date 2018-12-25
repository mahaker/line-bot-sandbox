export default class Point {

    private point: number = 0;

    get(): number {
        return this.point;
    }
    increment() {
        this.point++;
    }
}