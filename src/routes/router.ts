import express, { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';

export const router = express.Router();

router.use('/api/hello', (req: Request, res: Response) => res.send('Hello World!'));

// Catch 404 (ALWAYS keep this as the last route).
router.use('*', (req: Request, res: Response, next: NextFunction) => next(createError(404)));
