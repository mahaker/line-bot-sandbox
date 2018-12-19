import Provider from './quiz/Provider';
import Quiz from './quiz/Quiz';
import Kani from './quiz/Kani';
import Express, { Request, Response } from 'express';
import { 
    Client, middleware, ClientConfig, MiddlewareConfig, 
    MessageEvent,
    TextMessage, PostbackEvent,
    FlexMessage, FlexBubble, FlexBox, FlexImage, FlexText,
} from '@line/bot-sdk';

// TODO 環境変数か、.envファイルで指定したい。
const clientConfig: ClientConfig = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
};
const middlewareConfig: MiddlewareConfig = {
    channelSecret: process.env.LINE_CHANNEL_SECRET || '',
};

const botClient = new Client(clientConfig);
const botMiddleware = middleware(middlewareConfig);

const app = Express();

const CMD_MARU = 'まる！';
const CMD_BATSU = 'ばつ！';
const CMD_RESTART = 'restart';
const CMD_DETAIL = 'detail';
const CMD_NEXT = 'next';
const quizProvider: Provider = new Kani();
let currentQuiz: Quiz = quizProvider.next();

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

function handleEvent(event: MessageEvent | PostbackEvent) {
    if(event.type === 'postback') {
        handleRichMenuAction(event);
    } else if(event.type === 'message') {
        pushQuiz(event);
    }
}

// リッチメニュー上からのアクション
async function handleRichMenuAction(event: PostbackEvent) {
    const userId: string | undefined = event.source.userId;
    const data = JSON.parse(event.postback.data);

    if(data.cmd === 'answer') {
        const textMessage = currentQuiz.isCorrect(data.answer)? 'せいかい！' : 'はずれ！';
        if(!!userId) await botClient.pushMessage(userId, buildText(textMessage));
    } else if(data.cmd === 'ctrl') {
        switch(data.action) {
            case(CMD_RESTART):
                if(!!userId) {
                    quizProvider.init();
                    currentQuiz = quizProvider.next();
                    const message: FlexMessage = buildForm(currentQuiz);
                    await botClient.pushMessage(userId, message);
                }
                break;
            case(CMD_DETAIL):
                break;
            case(CMD_NEXT):
                if(!!userId) {
                    currentQuiz = quizProvider.hasNext()? quizProvider.next() : currentQuiz;
                    const message: FlexMessage = buildForm(currentQuiz);
                    await botClient.pushMessage(userId, message);
                }
                break;
        }
    }
}

// 普通のテキスト入力
async function pushQuiz(event: MessageEvent) {
    const userId: string | undefined = event.source.userId;
    if(!!userId) {
        await botClient.pushMessage(userId, buildForm(currentQuiz));
    }
}

// 「回答」を入力されていればtrue
function isAnswerText(txt: string): boolean {
    return txt === CMD_MARU || txt === CMD_BATSU;
}

function buildText(t: string): TextMessage {
    return {
        type: 'text',
        text: t,
    };
}

function buildForm(q: Quiz): FlexMessage {
    const flexHeaderContents: FlexText = {
        type: 'text',
        text: `問題${q.getNo()}`,
        size: 'lg',
        align: 'center',
        weight: 'bold',
    }
    const flexHeader: FlexBox = {
        type: 'box',
        layout: 'horizontal',
        contents: [flexHeaderContents],
    }
    const flexHero: FlexImage = {
        type: 'image',
        url: q.getImageUrl(),
    }
    const flexBodyContents: FlexText = {
        type: 'text',
        text: q.getText(),
        size: 'md',
        align: 'start',
        wrap: true,
    }
    const flexBody: FlexBox = {
        type: 'box',
        layout: 'horizontal',
        spacing: 'md',
        contents: [flexBodyContents],
    }
    const flexContents: FlexBubble = {
        type: 'bubble',
        direction: 'ltr',
        header: flexHeader,
        hero: flexHero,
        body: flexBody,
    }
    const message: FlexMessage = {
        type: 'flex',
        altText: 'Flex message',
        contents: flexContents,
    }
    return message;
}

export default app;
