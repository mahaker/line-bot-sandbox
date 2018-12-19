import Provider from './quiz/Provider';
import Quiz from './quiz/Quiz';
import Kani from './quiz/Kani';
import Express, { Request, Response } from 'express';
import { 
    Client, middleware, ClientConfig, MiddlewareConfig, 
    MessageEvent,
    TextMessage, TextEventMessage,
    PostbackEvent,
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

function handleEvent(event: MessageEvent | PostbackEvent): Promise<any> {
    if(event.type === 'postback') {
        console.log('ポストバック！');
        return Promise.resolve(null);
    } else {
        return pushQuiz(event);
    }
}

// 普通のテキスト入力
function pushQuiz(event: MessageEvent): Promise<any> {
    const userId: string | undefined = event.source.userId;

    const m: TextEventMessage = event.message as TextEventMessage;
    
    if(isAnswerText(m.text) && !!userId) {
        let textMessage: TextMessage | undefined = undefined;
        switch(m.text) {
            case(CMD_MARU):
                currentQuiz.isCorrect(true);
                textMessage = buildText('せいかい!');
                break;
            case(CMD_BATSU):
                currentQuiz.isCorrect(false);
                textMessage = buildText('はずれ!');
                break;
        }
        quizProvider.hasNext()? currentQuiz = quizProvider.next() : currentQuiz;
        return !!textMessage? botClient.pushMessage(userId, textMessage).then(() => {
            const message: FlexMessage = buildForm(currentQuiz);
            botClient.pushMessage(userId, message);
        }) : Promise.resolve(null); 
    } else if(!isAnswerText(m.text) && !!userId) {
        const message: FlexMessage = buildForm(currentQuiz);
        return botClient.pushMessage(userId, message);
    } else {
        return Promise.resolve(null);
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
