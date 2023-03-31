import express, { Request, Response, NextFunction } from 'express'
import { WorkoutsController } from '../../../../controllers/WorkoutsController'
import { WebhooksController } from '../../../../controllers/WebhooksController'
import { container } from '../../../../config/bootstrap'

export const router = express.Router()

const workoutsController = container.resolve('WorkoutsController') as WorkoutsController
const webhooksController = container.resolve('WebhooksController') as WebhooksController


// Load workout by ID
router.param('id', (req: Request, res: Response, next: NextFunction, id: string) => workoutsController.loadWorkout(req, res, next, id))

// GET routes for /api/v1/workouts
router.get('/', (req: Request, res: Response, next: NextFunction) => workoutsController.getAll(req, res, next))
router.get('/:id', (req: Request, res: Response, next: NextFunction) => workoutsController.get(req, res, next))

// POST routes for /api/v1/workouts
router.post('/', (req: Request, res: Response, next: NextFunction) => workoutsController.create(req, res, next), (req: Request, res: Response, next: NextFunction) => webhooksController.fire(req, res, next))

router.post('/:id', (req: Request, res: Response, next: NextFunction) => workoutsController.addExerciseToWorkout(req, res, next))

// PATCH routes for /api/v1/workouts
router.patch('/:id', (req: Request, res: Response, next: NextFunction) => workoutsController.partiallyUpdate(req, res, next))

// PUT routes for /api/v1/workouts
router.put('/:id', (req: Request, res: Response, next: NextFunction) => workoutsController.update(req, res, next))

// DELETE routes for /api/v1/workouts
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => workoutsController.delete(req, res, next))

