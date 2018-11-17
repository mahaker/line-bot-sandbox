import Express, { NextFunction, Request, Response } from 'express';

const app = Express();

app.get('/', (request: Request, response: Response, next: NextFunction) => {
    return response.send('Hello mahaker!!');
});

app.listen(8080, () => {
    console.log('Server is running.');
});
export default app;
