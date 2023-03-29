import express, { NextFunction, Request, Response } from 'express'
import { UsersController } from '../../../../controllers/UsersController'
import { container } from '../../../../config/bootstrap'

export const router = express.Router()

const controller = container.resolve('UsersController') as UsersController

// POST routes for /api/v1/auth
router.post('/register', (req: Request, res: Response, next: NextFunction) => controller.register(req, res, next))
router.post('/login', (req: Request, res: Response, next: NextFunction) => controller.login(req, res, next))
