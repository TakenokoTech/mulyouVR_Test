import express, { NextFunction, Request, Response } from 'express';

import { File } from './utils/File';

export async function GetCheck(req: Request, res: Response, next: NextFunction) {
    const videoID = req.query.v;
    const rootDir = `${__dirname}/tmp/${videoID}`;
    const m3u8File = `${rootDir}/index.m3u8`;
    if (await File.isExist(m3u8File)) {
        res.status(200).json({ ready: true });
    } else {
        res.status(200).json({ ready: false });
    }
}
