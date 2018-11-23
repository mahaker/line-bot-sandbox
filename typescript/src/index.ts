import Express, { Request, Response } from 'express';
import { 
    Client, middleware, 
    ClientConfig, MiddlewareConfig, 
    WebhookEvent, TemplateMessage, TemplateConfirm, Action } from '@line/bot-sdk';
import Slideshare from './Slideshare';

const clientConfig: ClientConfig = {
    channelAccessToken: 'ARwyenJOtWdAY/mKwItsp2eVHc5DLkBxUashhLOeRdkwQBTooRuMu+EBckCkRTZ8xWM30x3/U7TSUgqHZ3YO+RicTcBPoos/OKSAHBQzzxpzxRVZ03lddNJ1viCqq0G77N9CRZbYm62wPnO7YbNpCgdB04t89/1O/w1cDnyilFU=',
};
const middlewareConfig: MiddlewareConfig = {
    channelSecret: 'ef08dab5f407bd5e324c989267c8ecc1',
};
const botClient = new Client(clientConfig);
const botMiddleware = middleware(middlewareConfig);

const app = Express();

(async () => {
    const slideshare = new Slideshare();
    const str = await slideshare.search('line');
    // console.log(str);
})(); 

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

    const messageActions: Action[] = [
        {
            type: 'message',
            label: 'yes',
            text: 'text1',
        },
        {
            type: 'message',
            label: 'no',
            text: 'text2',
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
    return !!userId? botClient.pushMessage(userId, message) : Promise.resolve(null);
}

const port: any = process.env.PORT || 8888;
app.listen(port, () => {
    console.log('Server is running.');
});
