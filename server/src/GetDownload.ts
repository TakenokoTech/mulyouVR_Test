import { exec } from 'child_process';
import express, { Request, Response } from 'express';
import fs from 'fs';
import youtubeDL from 'youtube-dl';

import DownloadRepository from './DownloadRepository';

const videoState: { [key: string]: Promise<DownloadResult | ErrorResult> } = {};

export interface DownloadResult {
    id: string;
    url: string;
    hlsUrl: string;
    ext: string;
    data: string;
    width: number;
    height: number;
}

export interface ErrorResult {
    message: string;
}

async function downloadMP4(req: Request): Promise<DownloadResult | ErrorResult> {
    console.log(`download. v:${req.query.v}`);

    if (videoState[req.query.v]) {
        console.log(`pending... ${req.query.v}`);
        return videoState[req.query.v];
    }

    videoState[req.query.v] = new Promise(async resolve => {
        const videoID = req.query.v;
        const movieFilePath = `${__dirname}/tmp/${videoID}.mp4`;
        const jsonFilePath = `${__dirname}/tmp/${videoID}.json`;
        const result: DownloadResult = { id: videoID, url: '', hlsUrl: '', ext: '', data: '', width: 0, height: 0 };

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

function downloadM3U8(v: string): Promise<string> {
    const ffmpeg = `${__dirname}/../ffmpeg/bin/ffmpeg.exe`;
    const rootDir = `${__dirname}/tmp/${v}`;
    const mp4File = `${__dirname}/tmp/${v}.mp4`;
    const tsFile = `${rootDir}/%3d.ts`;
    const m3u8File = `${rootDir}/index.m3u8`;
    const cmd = `${ffmpeg} -i ${mp4File} -c:v copy -c:a copy -f hls -hls_time 20 -hls_playlist_type vod -hls_segment_filename "${tsFile}" ${m3u8File}`;
    return new Promise<string>(async (resolve, reject) => {
        if (await isExist(m3u8File)) {
            resolve(`${v}/index.m3u8`);
            return;
        }
        if (!(await isExist(rootDir))) {
            fs.mkdirSync(rootDir);
        }
        exec(cmd, (err, stdout, stderr) => {
            if (err) reject(err);
            else resolve(`${v}/index.m3u8`);
        });
    });
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
        const result = await downloadMP4(req);
        if (isError(result)) {
            console.log('400. ', result.message);
            res.status(400).json(result);
            return;
        }
        const hlsUrl = await downloadM3U8(result.id);
        DownloadRepository.upsert(
            { uuid: req.query.uuid, videoid: result.id },
            { uuid: req.query.uuid, videoid: result.id, expires: DownloadRepository.expires() },
            true,
        );
        result.url = `http://${req.headers.host}` + `/video/${result.id}.${result.ext}`;
        result.hlsUrl = `http://${req.headers.host}` + `/video/${hlsUrl}`;
        console.log('200. ', result.id);
        res.status(200).json(result);
    })();
}

function isError(arg: any): arg is ErrorResult {
    return arg !== null && typeof arg === 'object' && typeof arg.message === 'string';
}

// m3u8('MEFCNKjT5k8');
