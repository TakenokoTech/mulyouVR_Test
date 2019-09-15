import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import NodeMediaServer from 'node-media-server';

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

new NodeMediaServer({
    logType: 3,
    rtmp: { port: 1935, chunk_size: 60000, gop_cache: true, ping: 30, ping_timeout: 60 },
    http: { port: 8000, allow_origin: '*', mediaroot: `${__dirname}/tmp` },
    trans: {
        ffmpeg: `${__dirname}/../ffmpeg/bin/ffmpeg.exe`,
        tasks: [
            {
                app: 'live',
                hls: true,
                hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
                dash: true,
                dashFlags: '[f=dash:window_size=3:extra_window_size=5]',
            },
        ],
    },
}).run();
