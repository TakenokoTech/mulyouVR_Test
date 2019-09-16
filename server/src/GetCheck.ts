import express, { NextFunction, Request, Response } from 'express';

import { File } from './utils/File';
import { Log } from './utils/Log';

export async function GetCheck(req: Request, res: Response, next: NextFunction) {
    const videoID = req.query.v;
    const rootDir = `${__dirname}/tmp/${videoID}`;
    const m3u8File = `${rootDir}/index.m3u8`;

    const result = { ready: false };
    if (await File.isExist(m3u8File)) {
        result.ready = true;
    }

    Log.info('200.\n', result);
    res.status(200).json(result);
}
