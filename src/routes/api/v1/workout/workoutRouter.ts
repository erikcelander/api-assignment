import express, { Request, Response } from 'express'
import { Workout } from '../../../../models/workout'

import { WorkoutController } from '../../../../controllers/WorkoutController'
import { container } from '../../../../config/bootstrap'

export const router = express.Router()

const controller = container.resolve('WorkoutController') as WorkoutController

router.post('/create', async (req: Request, res: Response) => {
  try {
    const { name, exercises } = req.body
    const workout = new Workout({
      name,
      exercises
    })
    await workout.save()
    res.status(201).json({ message: 'Workout created successfully', workout })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})
