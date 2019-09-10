import express, { NextFunction, Request, Response } from 'express';

export function GetNotFound(req: Request, res: Response, next: NextFunction) {
    res.status(404).send('404 not found');
}
