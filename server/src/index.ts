import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';

import { GetDownload } from './GetDownload';
import { GetNotFound } from './GetNotFound';
import { DeletePolling, PostPolling } from './PostPolling';

const app = express();
app.use('*', cors());

app.use((req, res, next) => {
    console.info(`call. ${req.url}`);
    next();
});

app.use('/video', express.static(`${__dirname}/tmp`));
app.use('/static', express.static(`${__dirname}/../../prod-dist`));

app.post('/polling', PostPolling);
app.get('/download', GetDownload);
app.use(GetNotFound);

app.listen(3000, () => console.log('Listening on port 3000!'));
setInterval(DeletePolling, 10 * 1000);
