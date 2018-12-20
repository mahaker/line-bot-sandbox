import { Client } from '@line/bot-sdk';

export default class CheckListInterlocutor {
  private readonly userAndCheckNumbers: { [key: string]: number } = {};

  constructor(private botClient: Client) {}

  public start(userId: string): void {
    // ユーザから呼び出しを呼ばれるたびにインクリメント。
    let nowNumber = 1;
    const lastNumber = this.userAndCheckNumbers[userId];
    if (lastNumber) {
      nowNumber = lastNumber;
    }
    nowNumber++;
    this.userAndCheckNumbers[userId] = nowNumber;
    console.log(userId + ':' + nowNumber);
  }
}
