import Provider from '@/quiz/Provider';
import DoneQuiz from '@/quiz/DoneQuiz';
import Quiz, { Detail, Column } from '@/quiz/Quiz';
import Kani from '@/quiz/Kani';
import { Command } from '@/cmd/Command';
import Point from '@/quiz/Point';
import Express, { Request, Response } from 'express';
import CheckListInterlocutor from '@/checklist/CheckListInterlocutor';
import MessageInnerData from '@/checklist/message/MessageInnerData';
import {
    Client, middleware, ClientConfig, MiddlewareConfig,
    Action, MessageEvent,
    TextEventMessage, TextMessage, PostbackEvent,
    FlexMessage, FlexBubble, FlexBox, FlexImage, FlexText,
    TemplateColumn, TemplateMessage, TemplateCarousel,
} from '@line/bot-sdk';

/**
 * アプリ全体のTODO
 * 複数ユーザーでテスト
 * replyChecklistとhandleQuizControlを上手に見分けられるようにする。
 */

const clientConfig: ClientConfig = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || 'channel access token',
};
const middlewareConfig: MiddlewareConfig = {
    channelSecret: process.env.LINE_CHANNEL_SECRET || 'channel secret',
};

const botClient = new Client(clientConfig);
const botMiddleware = middleware(middlewareConfig);

const app = Express();

const QUIZ_PROVIDER: Provider = new Kani();

// ユーザーとProviderのマッピング
const userProviderMap = new Map<string, Provider>();

// ユーザーと点数（point）のマッピング
const userPointMap = new Map<string, Point>();

// ユーザーと回答済みクイズのマッピング
const userDoneQuizMap = new Map<string, DoneQuiz>();

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
    if (userDoneQuizMap.get(userId) === undefined) {
        userDoneQuizMap.set(userId, new DoneQuiz());
    }

    if (event.type === 'postback') {
        if (MessageInnerData.parse(event.postback.data) !== undefined) {
            replayChecklist(event);
        } else {
            handleQuizControl(event);
        }
    } else if (event.type === 'message') {
        const messageEvent: MessageEvent = event as MessageEvent;
        const textEventMessage: TextEventMessage = messageEvent.message as TextEventMessage;

        if (textEventMessage.text === 'クイズ') {
            pushQuiz(userId);
        } else if (textEventMessage.text === 'チェックリスト') {
            await pushChecklist(messageEvent);
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

    const doneQuiz: DoneQuiz | undefined = userDoneQuizMap.get(userId);
    if (!doneQuiz) {
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
            if (!doneQuiz.isDone(currentQuiz)) point.increment();
        } else {
            isCorrect = 'はずれ！';
        }
        await botClient.pushMessage(userId, buildText(isCorrect));
        doneQuiz.add(currentQuiz);

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
                doneQuiz.init();
                pushQuiz(userId);
                break;
            case (Command.DETAIL):
                await botClient.pushMessage(userId, buildQuizDetail(currentQuiz));
                break;
            case (Command.CURRENT):
                pushQuiz(userId);
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

// クイズの詳細をカルーセルテンプレートで表現する。
function buildQuizDetail(q: Quiz): TemplateMessage {
    const quizColumns: Column[] = q.getColumns();
    
    const columns: TemplateColumn[] = quizColumns.map(c => {
        const details: Detail[] = c.details;
        const actions: Action[] = details.map(detail => {
            const action: Action = {
                type: 'uri',
                label: detail.text,
                uri: detail.uri,
            }
             return action;
        });
        const column: TemplateColumn = {
            thumbnailImageUrl: c.thumbnailImageUrl,
            title: c.title,
            text: c.text,
            actions: actions,
        }
        return column;
    });
    const carousel: TemplateCarousel = {
        type: 'carousel',
        columns: columns,
        imageAspectRatio: 'rectangle',
        imageSize: 'cover',
    }
    const message: TemplateMessage = {
        type: 'template',
        altText: 'quiz detail',
        template: carousel,
    }

    return message;
}

export default app;
