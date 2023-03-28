import express, { NextFunction, Request, Response } from 'express'
import { UserController } from '../../../../controllers/UserController'
import { container } from '../../../../config/bootstrap'

export const router = express.Router()

const controller = container.resolve('UserController') as UserController


router.post('/register', (req: Request, res: Response, next: NextFunction) => {
  controller.register(req, res, next)
})

router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  controller.login(req, res, next)
})
