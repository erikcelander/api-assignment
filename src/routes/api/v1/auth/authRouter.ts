import express, { Request, Response } from 'express'
import { UserController } from '../../../../controllers/UserController'
import { container } from '../../../../config/bootstrap'

export const router = express.Router()

const controller = container.resolve('UserController') as UserController


router.post('/register', (req: Request, res: Response ) => {
  controller.register(req, res, (error: any) => {
    res.status(500).json({ message: error.message })
  })
})

router.post('/login', (req: Request, res: Response ) => {
  controller.login(req, res, (error: any) => {
    res.status(500).json({ message: error.message })
  })
})
