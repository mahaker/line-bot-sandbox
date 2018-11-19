import Express, { Request, Response } from 'express';
import { Client, middleware, ClientConfig, MiddlewareConfig, WebhookEvent } from '@line/bot-sdk';
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

const slideshare = new Slideshare();
slideshare.search('yattom')
    .then(slides => {
        console.log(`Slides ${slides}`);
    });

app.get('/', (request: Request, response: Response) => {
    return response.send('Hello mahaker!!');
});

app.post('/webhook', botMiddleware, (request: Request, response: Response) => {
    console.log('/webhook');
    Promise
        .all(request.body.events.map(handleEvent))
        .then((result) => response.json(result))
        .catch((err) => {
            console.error(err);
            response.status(500).end();
        });
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

const port: any = process.env.PORT || 8888;
app.listen(port, () => {
    console.log('Server is running.');
});
