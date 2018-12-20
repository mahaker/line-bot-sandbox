import CheckResult from './CheckResult';

// PostbackMessageのdataに格納する情報
export default class MessageInnerData {
  public static parse(data: string): MessageInnerData | undefined {
    console.log('perseまできてる');

    if (data.indexOf(MessageInnerData.MESSAGE_DATA_PREFIX) !== 0)
      return undefined;

    console.log('プレフィックスは大丈夫');

    const values = data.split(',');
    const questionNumber = Number(values[1]);
    const checkResult = values[2] as CheckResult;

    console.log('checkResultの値は？:' + checkResult);

    return new MessageInnerData(questionNumber, checkResult);
  }

  private static readonly MESSAGE_DATA_PREFIX = 'checkListMessage';

  constructor(
    public readonly questionNumber: number,
    public readonly checkResult: CheckResult
  ) {}

  public serialize(): string {
    const values = [
      MessageInnerData.MESSAGE_DATA_PREFIX,
      this.questionNumber,
      this.checkResult
    ];
    return values.join(',');
  }
}
