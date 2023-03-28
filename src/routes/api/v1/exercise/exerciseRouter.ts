import express, { Request, Response } from 'express'
import { Exercise } from '../../../../models/exercise'

import { ExerciseController } from '../../../../controllers/ExerciseController'
import { container } from '../../../../config/bootstrap'

export const router = express.Router()

const controller = container.resolve('ExerciseController') as ExerciseController

router.post('/add', async (req: Request, res: Response) => {
  try {

    controller.add(req, res, (error: any) => {
      res.status(500).json({ message: error.message })
    })
    
    
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
