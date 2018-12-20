import { Client } from '@line/bot-sdk';
import CheckListResult from '../domain/CheckListResult';
import PlainMessage from './PlainMessage';

export default class FinishDialog {
  constructor(private botClient: Client) {}

  public async show(checkListResult: CheckListResult) {
    const message = new PlainMessage(this.botClient);
    await message.show(checkListResult.userId, 'よくできました');
  }
}
