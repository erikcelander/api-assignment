import express, { Request, Response } from 'express'
import { Exercise } from '../../../../models/exercise'

export const router = express.Router()

router.post('/add', async (req: Request, res: Response) => {
  try {
    const exercise = await Exercise.create({
      name: req.body.name.trim(),
      description: req.body.description?.trim(),
    })    

    res.status(201).json({ exercise })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})
