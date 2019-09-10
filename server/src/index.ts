import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';

import { GetDownload } from './GetDownload';
import { GetNotFound } from './GetNotFound';
import { DeletePolling, PostPolling } from './PostPolling';

const app = express();
app.use(cors());

app.post('/polling', PostPolling);
app.get('/download', GetDownload);
app.use('/video', express.static(`${__dirname}/tmp`));
app.use(GetNotFound);

app.listen(3000, () => console.log('Listening on port 3000!'));

setInterval(DeletePolling, 10 * 1000);
