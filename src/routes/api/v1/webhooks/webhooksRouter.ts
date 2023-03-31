import express, { Request, Response, NextFunction } from 'express'
import { WebhooksController } from '../../../../controllers/WebhooksController'
import { container } from '../../../../config/bootstrap'

export const router = express.Router()

const controller = container.resolve('WebhooksController') as WebhooksController

// POST route for /api/v1/webhooks
router.post('/', (req: Request, res: Response, next: NextFunction) => controller.create(req, res, next))

// DELETE route for /api/v1/webhooks/:id
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => controller.delete(req, res, next))
