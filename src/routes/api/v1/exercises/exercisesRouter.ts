import express, { Request, Response, NextFunction } from 'express'
import { ExercisesController } from '../../../../controllers/ExercisesController'
import { container } from '../../../../config/bootstrap'

export const router = express.Router()

const controller = container.resolve('ExercisesController') as ExercisesController

// Load exercise by ID
router.param('id', (req: Request, res: Response, next: NextFunction, id: string) => controller.loadExercise(req, res, next, id))

// GET routes for /api/v1/exercises
router.get('/', (req: Request, res: Response, next: NextFunction) => controller.getAll(req, res, next))
router.get('/:id', (req: Request, res: Response, next: NextFunction) => controller.get(req, res, next))

// POST routes for /api/v1/exercises
router.post('/', (req: Request, res: Response, next: NextFunction) => controller.create(req, res, next))

// PATCH routes for /api/v1/exercises
router.patch('/:id', (req: Request, res: Response, next: NextFunction) => controller.partiallyUpdate(req, res, next))

// PUT routes for /api/v1/exercises
router.put('/:id', (req: Request, res: Response, next: NextFunction) => controller.update(req, res, next))

// DELETE routes for /api/v1/exercises
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => controller.delete(req, res, next))

