import express, { Request, Response, NextFunction } from 'express'
import { Exercise } from '../../../../models/exercise'

import { ExerciseController } from '../../../../controllers/ExercisesController'
import { container } from '../../../../config/bootstrap'

export const router = express.Router()

const controller = container.resolve('ExercisesController') as ExerciseController

router.param('id', (req: Request, res: Response, next: NextFunction, id: string) => controller.loadExercise(req, res, next, id))

router.get('/', (req: Request, res: Response, next: NextFunction) => controller.get(req, res, next))

router.get('/:id', (req: Request, res: Response, next: NextFunction) => controller.getAll(req, res, next))

router.post('/add', (req: Request, res: Response, next: NextFunction) => controller.add(req, res, next))
