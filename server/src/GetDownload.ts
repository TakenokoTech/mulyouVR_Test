import express, { Request, Response } from 'express';
import fs from 'fs';
import youtubeDL from 'youtube-dl';

import DownloadRepository from './DownloadRepository';

export interface DownloadResult {
    id: string;
    url: string;
    ext: string;
    data: string;
    width: number;
    height: number;
}

async function download(req: Request): Promise<DownloadResult> {
    return new Promise(async resolve => {
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
                console.log('Download started');
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
            .pipe(fs.createWriteStream(movieFilePath));
    });
}

const isExist = (filePath: string) =>
    new Promise<Boolean>(resolve => {
        try {
            fs.statSync(filePath);
            resolve(true);
        } catch (e) {
            resolve(false);
        }
    });

export async function GetDownload(req: Request, res: Response) {
    console.log(req.query);
    const result = await download(req);
    DownloadRepository.upsert(
        { uuid: req.query.uuid, videoid: result.id },
        { uuid: req.query.uuid, videoid: result.id, expires: DownloadRepository.expires() },
        true,
    );
    res.status(200).json(result);
}
