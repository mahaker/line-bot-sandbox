import Provider from './quiz/Provider';
import Quiz from './quiz/Quiz';
import Kani from './quiz/Kani';
import { Command } from './cmd/Command';
import Point from './quiz/Point';
import Express, { Request, Response } from 'express';
import CheckListInterlocutor from './checklist/CheckListInterlocutor';
import MessageInnerData from './checklist/message/MessageInnerData';
import {
    Client, middleware, ClientConfig, MiddlewareConfig,
    MessageEvent,
    TextEventMessage, TextMessage, PostbackEvent,
    FlexMessage, FlexBubble, FlexBox, FlexImage, FlexText,
} from '@line/bot-sdk';

/**
 * アプリ全体のTODO
 * ProcfileをREADMEに書く。
 * クイズが最後までいったら、クイズを初期化する。
 * ボットが動いている様子を録画する。
 * lint対応
 * 複数ユーザーでテスト
 * 点数（正解だったクイズ）を表示する。
　 まずは全問回答する、という前提で。
　 スキップ（次のクイズ）が押される考慮
 * replyChecklistとhandleQuizControlを上手に見分けられるようにする。
 */

const clientConfig: ClientConfig = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
};
const middlewareConfig: MiddlewareConfig = {
    channelSecret: process.env.LINE_CHANNEL_SECRET || '',
};

const botClient = new Client(clientConfig);
const botMiddleware = middleware(middlewareConfig);

const app = Express();

const QUIZ_PROVIDER: Provider = new Kani();

// ユーザーとcurrentQuizのマッピング
const userProviderMap = new Map<string, Provider>();

// ユーザーと点数（point）のマッピング
const userPointMap = new Map<string, Point>();

const checklist: CheckListInterlocutor = new CheckListInterlocutor(botClient);

// 不要なコントローラー（サーバー起動の動作確認のため、だった気がする）
app.get('/', (request: Request, response: Response) => {
    return response.send('Hello mahaker!!');
});

app.post('/webhook', botMiddleware, (request: Request, response: Response) => {
    Promise
        .all(request.body.events.map(handleEvent))
        .then((result) => response.json(result))
        .catch((err) => {
            console.error(err);
            response.status(500).end();
        });
});

async function handleEvent(event: MessageEvent | PostbackEvent) {
    const userId: string | undefined = event.source.userId;
    if (!userId) return;

    // 初めてボットを利用するユーザーはMapに追加
    if (userProviderMap.get(userId) === undefined) {
        userProviderMap.set(userId, QUIZ_PROVIDER);
    }
    if (userPointMap.get(userId) === undefined) {
        userPointMap.set(userId, new Point());
    }

    if (event.type === 'postback') {
        if (MessageInnerData.parse(event.postback.data) !== undefined) {
            replayChecklist(event);
        } else {
            handleQuizControl(event)
        }
    } else if (event.type === 'message') {
        const _event: MessageEvent = event as MessageEvent;
        const _textEventMessage: TextEventMessage = _event.message as TextEventMessage;

        if (_textEventMessage.text === 'クイズ') {
            pushQuiz(userId);
        } else if (_textEventMessage.text === 'チェックリスト') {
            await pushChecklist(_event);
        } else {
            await botClient.pushMessage(userId, buildText('不正な入力です。クイズをする場合は「クイズ」、チェックリストをする場合は「チェックリスト」と入力してください。'));
        }
    }
}

// リッチメニュー上からのアクション
async function handleQuizControl(event: PostbackEvent) {
    const userId: string | undefined = event.source.userId;
    const data = JSON.parse(event.postback.data);

    if (!userId) {
        return;
    }

    const quizProvider: Provider | undefined = userProviderMap.get(userId);
    if (!quizProvider) {
        return;
    }

    const point: Point | undefined = userPointMap.get(userId);
    if (!point) {
        return;
    }
    const currentQuiz: Quiz = quizProvider.current();

    if (data.cmd === 'answer') {
        let isCorrect = '';
        if (currentQuiz.isCorrect(data.answer)) {
            isCorrect = 'せいかい！';
            point.increment();
        } else {
            isCorrect = 'はずれ！';
        }
        await botClient.pushMessage(userId, buildText(isCorrect));

        if (quizProvider.hasNext()) {
            quizProvider.next();
            pushQuiz(userId);
        } else {
            await botClient.pushMessage(userId, buildText(`最後の問題です。点数は ${point.get()} 点でした！`));
        }
    } else if (data.cmd === 'ctrl') {
        switch (data.action) {
            case (Command.RESTART):
                point.init();
                quizProvider.init();
                pushQuiz(userId);
                break;
            case (Command.DETAIL):
                await botClient.pushMessage(userId, buildText(currentQuiz.getDetail()));
                break;
            case (Command.NEXT):
                if (quizProvider.hasNext()) {
                    quizProvider.next();
                    pushQuiz(userId);
                } else {
                    await botClient.pushMessage(userId, buildText('最後の問題です。'));
                }
                break;
        }
    }
}

// 睡眠クイズを返す。
async function pushQuiz(userId: string) {
    const provider: Provider | undefined = userProviderMap.get(userId);
    if (provider === undefined) {
        return;
    }
    const quiz: Quiz = provider.current();
    await botClient.pushMessage(userId, buildQuizForm(quiz));
}

// チェックリストを返す。
async function pushChecklist(event: MessageEvent) {
    const userId = event.source.userId;
    if (!userId) return;
    await checklist.start(userId);
}

// チェックリストの返答なら処理する。
function replayChecklist(event: PostbackEvent): boolean {
    const userId = event.source.userId;
    if (!userId) return false;
    checklist.reply(userId, event);
    return true;
}

// テキストメッセージを返す。最大2000文字
function buildText(t: string): TextMessage {
    return {
        type: 'text',
        text: t,
    };
}

function buildQuizForm(q: Quiz): FlexMessage {
    const flexHeaderContents: FlexText = {
        type: 'text',
        text: `問題${q.getNo()}`,
        size: 'lg',
        align: 'center',
        weight: 'bold',
    };
    const flexHeader: FlexBox = {
        type: 'box',
        layout: 'horizontal',
        contents: [flexHeaderContents],
    };
    const flexHero: FlexImage = {
        type: 'image',
        url: q.getImageUrl(),
    };
    const flexBodyContents: FlexText = {
        type: 'text',
        text: q.getText(),
        size: 'md',
        align: 'start',
        wrap: true,
    };
    const flexBody: FlexBox = {
        type: 'box',
        layout: 'horizontal',
        spacing: 'md',
        contents: [flexBodyContents],
    };
    const flexContents: FlexBubble = {
        type: 'bubble',
        direction: 'ltr',
        header: flexHeader,
        hero: flexHero,
        body: flexBody,
    };
    const message: FlexMessage = {
        type: 'flex',
        altText: 'Flex message',
        contents: flexContents,
    };
    return message;
}

export default app;
