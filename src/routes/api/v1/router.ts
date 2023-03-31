import express, { Request, Response, NextFunction } from 'express'
import { router as authRouter } from './auth/authRouter'
import { router as workoutsRouter } from './workouts/workoutsRouter'
import { router as exercisesRouter } from './exercises/exercisesRouter'
import { container } from '../../../config/bootstrap'
import { UsersController } from '../../../controllers/UsersController'
import { router as webhooksRouter } from './webhooks/webhooksRouter'


const usersController = container.resolve('UsersController') as UsersController

export const router = express.Router()

// Routes for authentication
router.use('/auth', authRouter)

// Routes for workouts, protected by JWT authentication
router.use('/workouts', usersController.authenticateJWT, workoutsRouter)

// Routes for exercises, protected by JWT authentication
router.use('/exercises', usersController.authenticateJWT, exercisesRouter)

// Routes for webhooks, protected by JWT authentication
router.use('/webhooks', usersController.authenticateJWT, webhooksRouter)

