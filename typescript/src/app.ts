import Quiz from './quiz/Quiz';
import Kani from './quiz/Kani';
import Express, { Request, Response } from 'express';
import { 
    Client, middleware, 
    ClientConfig, MiddlewareConfig, 
    WebhookEvent, MessageEvent, PostbackEvent,
    TemplateMessage, TemplateConfirm, TextMessage, Action, TextEventMessage} from '@line/bot-sdk';

// TODO 環境変数で指定したい。
const clientConfig: ClientConfig = {
    channelAccessToken: 'ARwyenJOtWdAY/mKwItsp2eVHc5DLkBxUashhLOeRdkwQBTooRuMu+EBckCkRTZ8xWM30x3/U7TSUgqHZ3YO+RicTcBPoos/OKSAHBQzzxpzxRVZ03lddNJ1viCqq0G77N9CRZbYm62wPnO7YbNpCgdB04t89/1O/w1cDnyilFU=',
};
const middlewareConfig: MiddlewareConfig = {
    channelSecret: 'ef08dab5f407bd5e324c989267c8ecc1',
};

const botClient = new Client(clientConfig);
const botMiddleware = middleware(middlewareConfig);

const app = Express();

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
    const userId: string | undefined = event.source.userId;

    console.log('handleEvent');

    if(event.type === 'postback') {
        console.log('ポストバック!');
        return Promise.resolve(null);
    } else {
        const e: MessageEvent = event as MessageEvent; // TODO なんとかしたい
        const m: TextEventMessage = e.message as TextEventMessage; // TODO なんとかしたい
    
        const textMessage: TextMessage = {
            type: 'text',
            text: `${m.text}クイズ！`
        }

        const kani = new Kani();

        if(!!userId && kani.hasNext()) {
            const message: TemplateMessage = buildForm(kani.next());
            botClient.pushMessage(userId, textMessage);
            return botClient.pushMessage(userId, message);
        } else {
            return Promise.resolve(null);
        }
    }
}

function buildForm(q: Quiz): TemplateMessage {
    const messageActions: Action[] = [
        {
            type: 'postback',
            label: 'yes',
            displayText: 'yes',
            data: `no=${q.getNo},answer=true`,
        },
        {
            type: 'postback',
            label: 'no',
            displayText: 'no',
            data: `no=${q.getNo},answer=false`,
        },
    ];

    const templateConfirm: TemplateConfirm = {
        type: 'confirm',
        text: q.getText(),
        actions: messageActions, 
    }; 

    const message: TemplateMessage = {
        type: 'template',
        altText: 'confirm message',
        template: templateConfirm,
    }
    return message;
}

export default app;
