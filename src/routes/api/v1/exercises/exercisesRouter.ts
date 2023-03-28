import express, { Request, Response, NextFunction } from 'express'
import { Exercise } from '../../../../models/exercise'

import { ExerciseController } from '../../../../controllers/ExercisesController'
import { container } from '../../../../config/bootstrap'

export const router = express.Router()

const controller = container.resolve('ExercisesController') as ExerciseController

router.param('id', (req: Request, res: Response, next: NextFunction, id: string) => controller.loadExercise(req, res, next, id))

// GET /api/v1/exercises
router.get('/', (req: Request, res: Response, next: NextFunction) => controller.get(req, res, next))
router.get('/:id', (req: Request, res: Response, next: NextFunction) => controller.getAll(req, res, next))

// POST /api/v1/exercises
router.post('/add', (req: Request, res: Response, next: NextFunction) => controller.add(req, res, next))

// PATCH /api/v1/exercises/:id
router.patch('/:id', (req: Request, res: Response, next: NextFunction) => controller.partiallyUpdate(req, res, next))

// PUT /api/v1/exercises/:id
router.put('/:id', (req: Request, res: Response, next: NextFunction) => controller.update(req, res, next))

// DELETE /api/v1/exercises/:id
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => controller.delete(req, res, next))

