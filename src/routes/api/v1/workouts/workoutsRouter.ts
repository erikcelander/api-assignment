import express, { Request, Response, NextFunction } from 'express'
import { Workout } from '../../../../models/workout'

import { WorkoutController } from '../../../../controllers/WorkoutsController'
import { container } from '../../../../config/bootstrap'
import { AuthenticatedRequest } from '../../../../middleware/authJWT'

export const router = express.Router()

const controller = container.resolve('WorkoutsController') as WorkoutController

router.param('id', (req: Request, res: Response, next: NextFunction, id: string) => controller.loadWorkout(req, res, next, id))

// GET routes for /api/v1/workouts
router.get('/', (req: Request, res: Response, next: NextFunction) => controller.getAll(req, res, next))
router.get('/:id', (req: Request, res: Response, next: NextFunction) => controller.get(req, res, next))

// POST routes for /api/v1/workouts
router.post('/create', (req: Request, res: Response, next: NextFunction) => controller.create(req, res, next))

// PATCH routes for /api/v1/workouts
router.patch('/:id', (req: Request, res: Response, next: NextFunction) => { controller.loadWorkout,controller.partiallyUpdate(req, res, next) })

// PUT routes for /api/v1/workouts
router.put('/:id', (req: Request, res: Response, next: NextFunction) => { controller.loadWorkout,controller.update(req, res, next) })

// DELETE routes for /api/v1/workouts
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => { controller.loadWorkout, controller.delete(req, res, next) })
