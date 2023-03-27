import express, { Request, Response } from 'express'
import { AuthController } from '../../../../controllers/authController'

export const router = express.Router()
const controller = new AuthController()


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
