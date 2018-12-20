export default class CheckListQuestions {
  private static readonly Q_TEXTS = [
    '毎朝、ほぼ決まった時間に起きる',
    '朝、起きたら太陽の光をしっかり浴びる',
    '朝食を規則正しく毎日とる',
    '帰宅後は居眠り(仮眠)をしない',
    '定期的に適度な運動をする',
    'お風呂は早めに入る(寝る直前の場合はぬるめのお風呂に浸かる)',
    '夕食は寝る2時間前までに済ませる(夕食が遅くなる場合は夕方に食べておく)',
    '夕食後に夜食を取らない',
    '夕食以降、お茶、コーヒーなどのカフェインはさける',
    '寝る直前はデジタル機器(スマホ、ゲームなど)を利用しない',
    '毎晩、ほぼ決まった時間に寝る',
    '必要な睡眠時間を確保する',
    '休日の起床時間が平日と2時間以上ずれないようにする'
  ];

  public get(questionNumber: number): string {
    return CheckListQuestions.Q_TEXTS[questionNumber - 1];
  }

  public count(): number {
    return CheckListQuestions.Q_TEXTS.length;
  }
  public isFinished(questionNumber: number): boolean {
    return this.count() < questionNumber;
  }
}
