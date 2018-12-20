import {
  Client,
  FlexText,
  FlexBox,
  FlexBubble,
  FlexMessage
} from '@line/bot-sdk';
import CheckListResult from './CheckListResult';

export default class FinishDialog {
  constructor(private botClient: Client) {}

  public async show(checkListResult: CheckListResult) {
    const flexHeaderContents: FlexText = {
      type: 'text',
      text: `問題`,
      size: 'lg',
      align: 'center',
      weight: 'bold'
    };
    const flexHeader: FlexBox = {
      type: 'box',
      layout: 'horizontal',
      contents: [flexHeaderContents]
    };
    const flexBodyContents: FlexText = {
      type: 'text',
      text: 'ここ、よくわからない',
      size: 'md',
      align: 'start',
      wrap: true
    };
    const flexBody: FlexBox = {
      type: 'box',
      layout: 'horizontal',
      spacing: 'md',
      contents: [flexBodyContents]
    };
    const flexContents: FlexBubble = {
      type: 'bubble',
      direction: 'ltr',
      header: flexHeader,
      body: flexBody
    };
    const message: FlexMessage = {
      type: 'flex',
      altText: 'Flex message',
      contents: flexContents
    };
    await this.botClient.pushMessage(checkListResult.userId, message);
  }
}
