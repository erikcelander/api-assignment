import express, { Request, Response, NextFunction } from 'express'
import { Workout } from '../../../../models/workout'

import { WorkoutController } from '../../../../controllers/WorkoutsController'
import { container } from '../../../../config/bootstrap'
import { AuthenticatedRequest } from '../../../../middleware/authJWT'

export const router = express.Router()

const controller = container.resolve('WorkoutsController') as WorkoutController

router.param('id', (req: Request, res: Response, next: NextFunction, id: string) => controller.loadWorkout(req, res, next, id))


router.post('/create', async (req: Request, res: Response) => {
  try {
    res.status(201).json({ message: `User ID: ${(req as AuthenticatedRequest).user.id}`})

   /* const { name, exercises } = req.body
    const workout = new Workout({
      name,
      exercises
    })
    await workout.save()
    res.status(201).json({ message: 'Workout created successfully', workout }) */
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})
