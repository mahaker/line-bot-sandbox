import Provider from './quiz/Provider';
import Quiz from './quiz/Quiz';
import Kani from './quiz/Kani';
import Express, { Request, Response } from 'express';
import { 
    Client, middleware, 
    ClientConfig, MiddlewareConfig, 
    MessageEvent, PostbackEvent,
    TemplateMessage, TemplateConfirm, TextMessage, Action, TextEventMessage} from '@line/bot-sdk';
import { SSL_OP_NETSCAPE_REUSE_CIPHER_CHANGE_BUG } from 'constants';

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
const kani = new Kani();
const quizProviders: Provider[] = [new Kani()];

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

    if(event.type === 'postback') {
        // クイズの回答を検証する。
        const _event: PostbackEvent = event as PostbackEvent;
        const data = JSON.parse(_event.postback.data);
        const quizNo: number = data.no;
        const selectedAnswer: boolean = data.answer;
        
        // TODO immutableにしたい
        const textMessage: TextMessage = {
            type: 'text',
            text: ''
        }
        const _kani: Quiz | undefined = kani.getQuizByNo(quizNo);
        if(!!_kani && _kani.isCorrect(quizNo, selectedAnswer)) {
            textMessage.text = '正解！！';
        } else {
            textMessage.text = '不正解！！';
        }
        return !!userId? botClient.pushMessage(userId, textMessage) : Promise.resolve(null);
    } else {
        // クイズそのものを返す。
        const e: MessageEvent = event as MessageEvent; // TODO なんとかしたい
        const m: TextEventMessage = e.message as TextEventMessage; // TODO なんとかしたい
    
        if(isValidProviderType(m.text)) {
            const textMessage: TextMessage = {
                type: 'text',
                text: `${m.text}クイズ！`
            }

            if(!!userId && kani.hasNext()) {
                const message: TemplateMessage = buildForm(kani.next());
                botClient.pushMessage(userId, textMessage);
                return botClient.pushMessage(userId, message);
            } else {
                return Promise.resolve(null);
            }
        } else {
            return Promise.resolve(null);
        }
    }
}

function isValidProviderType(providerType: string): boolean {
    return quizProviders.find(p => p.type === providerType) !== undefined;
}

function buildForm(q: Quiz): TemplateMessage {
    const messageActions: Action[] = [
        {
            type: 'postback',
            label: 'yes',
            displayText: 'yes',
            data: `${JSON.stringify({"no": q.getNo(), "answer": true})}`,
        },
        {
            type: 'postback',
            label: 'no',
            displayText: 'no',
            data: `${JSON.stringify({"no": q.getNo(), "answer": false})}`,
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
