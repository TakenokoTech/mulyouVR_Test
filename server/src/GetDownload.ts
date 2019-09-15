import { exec } from 'child_process';
import express, { Request, Response } from 'express';
import fs from 'fs';
import youtubeDL from 'youtube-dl';

import DownloadRepository from './DownloadRepository';

const videoState: { [key: string]: Promise<DownloadResult | ErrorResult> } = {};

export interface DownloadResult {
    id: string;
    url: string;
    ext: string;
    data: string;
    width: number;
    height: number;
}

export interface ErrorResult {
    message: string;
}

async function download(req: Request): Promise<DownloadResult | ErrorResult> {
    console.log(`download. v:${req.query.v}`);

    if (videoState[req.query.v]) {
        console.log(`pending... ${req.query.v}`);
        return videoState[req.query.v];
    }

    videoState[req.query.v] = new Promise(async resolve => {
        const videoID = req.query.v;
        const movieFilePath = `${__dirname}/tmp/${videoID}.mp4`;
        const jsonFilePath = `${__dirname}/tmp/${videoID}.json`;
        const result: DownloadResult = { id: videoID, url: '', ext: '', data: '', width: 0, height: 0 };

        if ((await isExist(movieFilePath)) && (await isExist(jsonFilePath))) {
            const result = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
            resolve(result);
            return;
        }

        youtubeDL(`http://www.youtube.com/watch?v=${videoID}`, ['--format=18'], { cwd: __dirname })
            .on('info', (info: any) => {
                console.log('Download started', info.title);
                result.ext = info.ext;
                result.width = info.width;
                result.height = info.height;
                // console.log(info);
            })
            .on('complete', (info: any) => {
                console.log('filename: ' + info._filename + ' already downloaded.');
            })
            .on('end', (info: any) => {
                console.log('finished downloading!');
                result.url = `http://${req.headers.host}/video/${result.id}.${result.ext}`;
                fs.writeFileSync(jsonFilePath, JSON.stringify(result, null, '    '));
                fs.createReadStream(movieFilePath, 'utf8').on('data', data => {
                    result.data = data;
                    resolve(result);
                });
            })
            .on('error', err => {
                fs.unlinkSync(movieFilePath);
                resolve({ message: `${err}` });
            })
            .pipe(fs.createWriteStream(movieFilePath));
    });

    return videoState[req.query.v];
}

const isExist = (filePath: string) =>
    new Promise<number>(resolve => {
        try {
            fs.statSync(filePath);
            resolve(1);
        } catch (e) {
            resolve(0);
        }
    });

export function GetDownload(req: Request, res: Response) {
    console.log('GetDownload. ', req.query);
    (async () => {
        const result = await download(req);
        if (isError(result)) {
            console.log('400. ', result.message);
            res.status(400).json(result);
            return;
        }
        DownloadRepository.upsert(
            { uuid: req.query.uuid, videoid: result.id },
            { uuid: req.query.uuid, videoid: result.id, expires: DownloadRepository.expires() },
            true,
        );
        result.url = `http://${req.headers.host}` + `/video/${result.id}.${result.ext}`;
        // result.url = `http://192.168.0.106:8000` + `/${result.id}.${result.ext}`;

        console.log('200. ', result.id);
        res.status(200).json(result);
    })();
}

function isError(arg: any): arg is ErrorResult {
    return arg !== null && typeof arg === 'object' && typeof arg.message === 'string';
}

function m3u8() {
    console.log(exec);
    const v = 'MEFCNKjT5k8';
    const ffmpeg = `${__dirname}/../ffmpeg/bin/ffmpeg.exe`;
    const mp4File = `${__dirname}/tmp/${v}.mp4`;
    const tsFile = `${__dirname}/tmp/${v}/${v}%3d.ts`;
    const m3u8File = `${__dirname}/tmp/${v}/${v}.m3u8`;
    const cmd = `${ffmpeg} -i ${mp4File} -c:v copy -c:a copy -f hls -hls_time 9 -hls_playlist_type vod -hls_segment_filename "${tsFile}" ${m3u8File}`;
    exec(cmd, (err, stdout, stderr) => {
        if (err) console.log(err);
        console.log(stdout);
    });
}
