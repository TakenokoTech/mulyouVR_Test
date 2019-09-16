import express, { NextFunction, Request, Response } from 'express';

import DownloadRepository from './DownloadRepository';
import { Log } from './utils/Log';

export async function PostPolling(req: Request, res: Response, next: NextFunction) {
    Log.info('PostPolling.');
    Log.info(req.query);

    const expires = DownloadRepository.expires();
    await DownloadRepository.upsert({ uuid: req.query.uuid }, { $set: { uuid: req.query.uuid, expires: expires } });
    await DownloadRepository.select({});

    const result = { expires: expires };
    Log.info('200.\n', result);
    res.status(200).json(result);
}

export async function DeletePolling() {
    // console.log('\nDeletePolling');
    await DownloadRepository.select({ expires: { $lt: DownloadRepository.nowTime() } });
}
