import Express, { Request, Response } from 'express';
import { 
    Client, middleware, 
    ClientConfig, MiddlewareConfig, 
    WebhookEvent, MessageEvent, TemplateMessage, TemplateConfirm, TextMessage, Action, TextEventMessage} from '@line/bot-sdk';

const clientConfig: ClientConfig = {
    channelAccessToken: 'ARwyenJOtWdAY/mKwItsp2eVHc5DLkBxUashhLOeRdkwQBTooRuMu+EBckCkRTZ8xWM30x3/U7TSUgqHZ3YO+RicTcBPoos/OKSAHBQzzxpzxRVZ03lddNJ1viCqq0G77N9CRZbYm62wPnO7YbNpCgdB04t89/1O/w1cDnyilFU=',
};
const middlewareConfig: MiddlewareConfig = {
    channelSecret: 'ef08dab5f407bd5e324c989267c8ecc1',
};
const botClient = new Client(clientConfig);
const botMiddleware = middleware(middlewareConfig);

const app = Express();

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

function handleEvent(event: WebhookEvent): Promise<any> {
    const userId: string | undefined = event.source.userId;

    if(event.type === 'postback') {
        const textMessage: TextMessage = {
            type: 'text',
            text: 'ポストバックイベント！' 
        }
        return !!userId? botClient.pushMessage(userId, textMessage) : Promise.resolve(null);
    } else {
        const e: MessageEvent = event as MessageEvent;
        const m: TextEventMessage = e.message as TextEventMessage;
        const messageActions: Action[] = [
            {
                type: 'postback',
                label: 'yes',
                text: 'yes',
                data: 'yes',
            },
            {
                type: 'postback',
                label: 'no',
                text: 'no',
                 data: 'no',
            },
        ];

        const templateConfirm: TemplateConfirm = {
            type: 'confirm',
            text: 'Please confirm.',
            actions: messageActions, 
        }; 

        const message: TemplateMessage = {
            type: 'template',
            altText: 'template message alt',
            template: templateConfirm,
        }
    
        const textMessage: TextMessage = {
            type: 'text',
            text: `${m.text}クイズ！`
        }

        !!userId? botClient.pushMessage(userId, textMessage) : Promise.resolve(null);
        return !!userId? botClient.pushMessage(userId, message) : Promise.resolve(null);
    }
}

export default app;
