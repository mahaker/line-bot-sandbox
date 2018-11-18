import Express, { NextFunction, Request, Response } from 'express';
import { Client, middleware, ClientConfig, MiddlewareConfig, WebhookEvent } from '@line/bot-sdk';

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
        .then((result) => response.json(result));
});

function handleEvent(event: WebhookEvent) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }
  
    return botClient.replyMessage(event.replyToken, {
        type: 'text',
        text: event.message.text,
    });
}

app.listen(8080, () => {
    console.log('Server is running.');
});
export default app;
