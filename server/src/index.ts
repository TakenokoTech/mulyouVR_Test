import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';

import { GetCheck } from './GetCheck';
import { GetDownload } from './GetDownload';
import { GetNotFound } from './GetNotFound';
import { DeletePolling, PostPolling } from './PostPolling';
import { connectLogger, Log } from './utils/Log';

const app = express();
app.use(connectLogger);
app.use('*', cors());

app.use((req, res, next) => {
    Log.debug(`call. ${req.url}`);
    next();
});

app.use('/video', express.static(`${__dirname}/tmp`));
app.use('/static', express.static(`${__dirname}/../../prod-dist`));

app.post('/polling', PostPolling);
app.get('/download', GetDownload);
app.get('/check', GetCheck);
app.use(GetNotFound);

app.listen(3000, () => Log.info('Listening on port 3000!'));
setInterval(DeletePolling, 10 * 1000);
