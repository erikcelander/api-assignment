import express, { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'
import { router as v1Router } from './api/v1/router'
import { generateResourceLinks } from '../config/hateoas'

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

// Route to API v1
router.use('/api/v1', v1Router)

// Catch 404 (ALWAYS keep this as the last route).
// This middleware handles the case when the requested route is not found
router.use('*', (req: Request, res: Response, next: NextFunction) => next(createError(404)))
