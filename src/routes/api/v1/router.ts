import express, { Request, Response, NextFunction } from 'express'
import { router as authRouter } from './auth/authRouter'
import { router as workoutsRouter } from './workouts/workoutsRouter'
import { router as exercisesRouter } from './exercises/exercisesRouter'
import { container } from '../../../config/bootstrap'
import { UsersController } from '../../../controllers/UsersController'

const usersController = container.resolve('UsersController') as UsersController

export const router = express.Router()

router.use('/auth', authRouter)
router.use('/workouts', usersController.authenticateJWT, workoutsRouter)
router.use('/exercises', usersController.authenticateJWT, exercisesRouter)