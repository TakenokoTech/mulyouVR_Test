import express, { NextFunction, Request, Response } from 'express';

import DownloadRepository from './DownloadRepository';

export async function PostPolling(req: Request, res: Response, next: NextFunction) {
    console.log('\nPostPolling');
    console.log(req.query);
    await DownloadRepository.upsert({ uuid: req.query.uuid }, { $set: { uuid: req.query.uuid, expires: DownloadRepository.expires() } });
    await DownloadRepository.select({});
    res.status(200).send('ok');
}

export async function DeletePolling() {
    console.log('\nDeletePolling');
    await DownloadRepository.select({ expires: { $lt: DownloadRepository.nowTime() } });
}
