export default class Greeter {
    private readonly greeting: string;

    constructor(g: string) {
        this.greeting = g;
    }

    public greet(): string {
        return this.greeting;
    }
}
