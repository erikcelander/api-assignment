import express, { Request, Response, NextFunction } from 'express'
import { Exercise } from '../../../../models/exercise'

import { ExerciseController } from '../../../../controllers/ExercisesController'
import { container } from '../../../../config/bootstrap'

export const router = express.Router()

const controller = container.resolve('ExerciseController') as ExerciseController

router.post('/add', async (req: Request, res: Response, next: NextFunction) => {
  try {
    controller.add(req, res, next)


    
  
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})
