import CheckResult from './CheckResult';

export default class CheckListResult {
    private readonly results: CheckResult[] = [];

    constructor(public readonly userId: string) {}

    public nowNumber(): number {
        return this.results.length + 1;
    }

    public recordResult(result: CheckResult) {
        this.results[this.nowNumber() - 1] = result;
    }

    public countOf(result: CheckResult): number {
        return this.results.filter(r => r === result).length;
    }

    public maxPoint(): number {
        const resultTypeLength = Object.keys(CheckResult).length;
        return this.results.length * resultTypeLength;
    }

    public calculatePoint(): number {
        const resultTypeLength = Object.keys(CheckResult).length;
        let index = -1;
        let point = 0;
        for (const item in CheckResult) {
            index++;
            const level = resultTypeLength - index;
            const resultType = item as CheckResult;

            const count = this.countOf(resultType);
            point += level * count;
        }
        return point;
    }
}
