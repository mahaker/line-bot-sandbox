export default class Point {

    private point: number = 0;

    public init() {
        this.point = 0;
    }
    public get(): number {
        return this.point;
    }
    public increment() {
        this.point++;
    }
}
