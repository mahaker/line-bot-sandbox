import CheckListResult from './CheckListResult';
import CheckResult from './CheckResult';

export default class CheckListResults {
  private readonly userResults: { [key: string]: CheckListResult } = {};

  public initilize(userId: string) {
    this.userResults[userId] = new CheckListResult(userId);
  }

  public nowNumber(userId: string): number {
    const result = this.userResults[userId];
    if (!result) return 0;
    return result.nowNumber();
  }

  public existsCheckList(userId: string): boolean {
    return !!this.userResults[userId];
  }

  public recordResult(userId: string, result: CheckResult): void {
    const oneUserResult = this.userResults[userId];
    oneUserResult.recordResult(result);
  }

  public goal(userId: string): CheckListResult {
    const oneUserResult = this.userResults[userId];
    delete this.userResults[userId];
    return oneUserResult;
  }
}
