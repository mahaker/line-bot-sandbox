import Provider from './quiz/Provider';
import Quiz from './quiz/Quiz';
import Kani from './quiz/Kani';
import Express, { Request, Response } from 'express';
import { 
    Client, middleware, 
    ClientConfig, MiddlewareConfig, 
    MessageEvent, PostbackEvent,
    TemplateMessage, TemplateConfirm, TextMessage, Action, TextEventMessage} from '@line/bot-sdk';

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
const quizProvider: Provider = new Kani();
let quiz: Quiz = quizProvider.next();

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
        const _quizProvider: Quiz | undefined = quizProvider.getQuizByNo(quizNo);
        if(!!_quizProvider && _quizProvider.isCorrect(quizNo, selectedAnswer)) {
            textMessage.text = '正解！！';
        } else {
            textMessage.text = '不正解！！';
        }
        !!userId? botClient.pushMessage(userId, textMessage) : Promise.resolve(null);
        if(quizProvider.hasNext()) {
            quiz = quizProvider.next();
        } else {
            const textMessage: TextMessage = {
                type: 'text',
                text: 'クイズは終了です！' 
            }
            !!userId? botClient.pushMessage(userId, textMessage) : Promise.resolve(null);
            quiz = quizProvider.init();
        }
        return Promise.resolve(null);
    } else {
        // クイズそのものを返す。
        const e: MessageEvent = event as MessageEvent; // TODO なんとかしたい
        const m: TextEventMessage = e.message as TextEventMessage; // TODO なんとかしたい
    
        if(isValidProviderType(m.text)) {
            const textMessage: TextMessage = {
                type: 'text',
                text: `${m.text}クイズ！`
            }

            if(!!userId) {
                const message: TemplateMessage = buildForm(quiz);
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
    return quizProvider.type === providerType;
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
