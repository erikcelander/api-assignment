import express, { Request, Response, NextFunction } from 'express'
import { router as authRouter } from './auth/authRouter'
import { router as workoutsRouter } from './workouts/workoutsRouter'
import { router as exercisesRouter } from './exercises/exercisesRouter'
import { container } from '../../../config/bootstrap'
import { UsersController } from '../../../controllers/UsersController'
import { router as webhooksRouter } from './webhooks/webhooksRouter'
import { generateResourceLinks } from '../../../config/hateoas'



const usersController = container.resolve('UsersController') as UsersController

export const router = express.Router()

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  const authLinks = generateResourceLinks('auth', '', 'all')
  const workoutLinks = generateResourceLinks('workout', '', 'all')
  const exerciseLinks = generateResourceLinks('exercise', '', 'all')
  const webhookLinks = generateResourceLinks('webhook', '', 'all')
  const links = [...authLinks, ...workoutLinks, ...exerciseLinks, ...webhookLinks]
  
  res.status(200).json({
    message: 'Welcome to the Workout Tracker API!',
    links: links
  })
})

// Routes for authentication
router.use('/auth', authRouter)

// Routes for workouts, protected by JWT authentication
router.use('/workouts', usersController.authenticateJWT, workoutsRouter)

// Routes for exercises, protected by JWT authentication
router.use('/exercises', usersController.authenticateJWT, exercisesRouter)

// Routes for webhooks, protected by JWT authentication
router.use('/webhooks', usersController.authenticateJWT, webhooksRouter)

