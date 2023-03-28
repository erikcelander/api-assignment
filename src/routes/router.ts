import express, { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'
import { router as authRouter } from './api/v1/auth/authRouter'
import { router as workoutsRouter } from './api/v1/workout/workoutRouter'
import { router as exercisesRouter } from './api/v1/exercise/exerciseRouter'


export const router = express.Router()

router.use('/api/v1/auth', authRouter)
router.use('/api/v1/workouts', workoutsRouter)
router.use('/api/v1/exercises', exercisesRouter)

// Catch 404 (ALWAYS keep this as the last route).
router.use('*', (req: Request, res: Response, next: NextFunction) => next(createError(404)))
