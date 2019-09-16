import { exec } from 'child_process';
import express, { Request, Response } from 'express';
import fs from 'fs';
import youtubeDL from 'youtube-dl';

import DownloadRepository from './DownloadRepository';
import { File } from './utils/File';
import { Log } from './utils/Log';

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

async function downloadMP4(videoID: string /*, req: Request*/, host: string): Promise<DownloadResult | ErrorResult> {
    Log.info(`downloadMP4. v:${videoID}`);
    if (videoState[videoID]) {
        Log.info(`pending... ${videoID}`);
        return videoState[videoID];
    }

    videoState[videoID] = new Promise(async resolve => {
        const movieFilePath = `${__dirname}/tmp/${videoID}.mp4`;
        const jsonFilePath = `${__dirname}/tmp/${videoID}.json`;
        const result: DownloadResult = { id: videoID, url: '', hlsUrl: '', ext: '', data: '', width: 0, height: 0 };

        if ((await File.isExist(movieFilePath)) && (await File.isExist(jsonFilePath))) {
            const result = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
            await downloadM3U8(result.id);
            resolve(result);
            return;
        }
        // result.url = `http://${host}/video/${result.id}.${result.ext}`;
        youtubeDL(`http://www.youtube.com/watch?v=${videoID}`, ['--format=18'], { cwd: __dirname })
            .on('info', (info: any) => {
                Log.info('Download started', info.title);
                result.ext = info.ext;
                result.width = info.width;
                result.height = info.height;
                resolve(result);
            })
            .on('complete', (info: any) => {
                Log.info('filename: ' + info._filename + ' already downloaded.');
            })
            .on('end', (info: any) => {
                Log.info('finished downloading!');
                fs.writeFileSync(jsonFilePath, JSON.stringify(result, null, '    '));
                fs.createReadStream(movieFilePath, 'utf8').on('data', data => {
                    result.data = data;
                });
                downloadM3U8(result.id);
            })
            .on('error', err => {
                fs.unlinkSync(movieFilePath);
                resolve({ message: `${err}` });
            })
            .pipe(fs.createWriteStream(movieFilePath));
    });

    return videoState[videoID];
}

function downloadM3U8(videoID: string): Promise<string> {
    Log.info(`downloadM3U8. v:${videoID}`);
    const ffmpeg = `${__dirname}/../ffmpeg/bin/ffmpeg.exe`;
    const rootDir = `${__dirname}/tmp/${videoID}`;
    const mp4File = `${__dirname}/tmp/${videoID}.mp4`;
    const tsFile = `${rootDir}/%3d.ts`;
    const m3u8File = `${rootDir}/index.m3u8`;
    const cmd = `${ffmpeg} -i ${mp4File} -c:v copy -c:a copy -f hls -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${tsFile}" ${m3u8File}`;
    return new Promise<string>(async (resolve, reject) => {
        if (await File.isExist(m3u8File)) {
            resolve(`${videoID}/index.m3u8`);
            return;
        }
        if (!(await File.isExist(rootDir))) {
            fs.mkdirSync(rootDir);
        }
        exec(cmd, (err, stdout, stderr) => {
            if (err) reject(err);
            else resolve(`${videoID}/index.m3u8`);
        });
    });
}

export function GetDownload(req: Request, res: Response) {
    Log.info('GetDownload. ', req.query);
    (async () => {
        const result = await downloadMP4(req.query.v, req.headers.host || '');
        if (isError(result)) {
            Log.info('400. ', result.message);
            res.status(400).json(result);
            return;
        }
        DownloadRepository.upsert(
            { uuid: req.query.uuid, videoid: result.id },
            { uuid: req.query.uuid, videoid: result.id, expires: DownloadRepository.expires() },
            true,
        );
        result.url = `http://${req.headers.host}` + `/video/${result.id}.${result.ext}`;
        result.hlsUrl = `http://${req.headers.host}` + `/video/${result.id}/index.m3u8`;
        Log.info('200. ', result);
        res.status(200).json(result);
    })();
}

function isError(arg: any): arg is ErrorResult {
    return arg !== null && typeof arg === 'object' && typeof arg.message === 'string';
}
