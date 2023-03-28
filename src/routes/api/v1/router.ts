import express, { Request, Response, NextFunction } from 'express'
import { router as authRouter } from './auth/authRouter'
import { router as workoutsRouter } from './workout/workoutRouter'
import { router as exercisesRouter } from './exercise/exerciseRouter'
import { authenticateJWT } from '../../../middleware/authJWT'


export const router = express.Router()

router.use('/auth', authRouter)
router.use('/workouts', authenticateJWT, workoutsRouter)
router.use('/exercises', authenticateJWT, exercisesRouter)