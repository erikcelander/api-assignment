import express, { Request, Response, NextFunction } from 'express'
import { Workout } from '../../../../models/workout'

import { WorkoutController } from '../../../../controllers/WorkoutsController'
import { container } from '../../../../config/bootstrap'
import { AuthenticatedRequest } from '../../../../middleware/authJWT'

export const router = express.Router()

const controller = container.resolve('WorkoutsController') as WorkoutController

router.param('id', (req: Request, res: Response, next: NextFunction, id: string) => controller.loadWorkout(req, res, next, id))

// GET /api/v1/workouts
router.get('/', (req: Request, res: Response, next: NextFunction) => controller.get(req, res, next))
router.get('/:id', (req: Request, res: Response, next: NextFunction) => controller.getAll(req, res, next))

// POST /api/v1/workouts
router.post('/create', (req: Request, res: Response, next: NextFunction) => controller.create(req, res, next))

// PATCH /api/v1/workouts/:id
router.patch('/:id', (req: Request, res: Response, next: NextFunction) => controller.partiallyUpdate(req, res, next))

// PUT /api/v1/workouts/:id
router.put('/:id', (req: Request, res: Response, next: NextFunction) => controller.update(req, res, next))

// DELETE /api/v1/workouts/:id
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => controller.delete(req, res, next))
