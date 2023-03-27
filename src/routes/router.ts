import express, { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'
import { router as authRouter } from './api/v1/auth/authRouter'
import { router as workoutsRouter } from './api/v1/workouts/workoutsRouter'


export const router = express.Router()

router.use('/api/v1/auth', authRouter)
router.use('/api/v1/workouts', workoutsRouter)


// Catch 404 (ALWAYS keep this as the last route).
router.use('*', (req: Request, res: Response, next: NextFunction) => next(createError(404)))
