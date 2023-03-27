import express, { Request, Response } from 'express'
import { Workout } from '../../../../models/workout'

export const router = express.Router()

router.post('/create', async (req: Request, res: Response) => {
  try {
    const { exercises } = req.body
    const workout = new Workout({
      exercises
    })
    await workout.save()
    res.status(201).json({ message: 'Workout created successfully', workout })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})
