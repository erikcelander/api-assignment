import express, { Request, Response } from 'express'

export const router = express.Router()

router.post('/register', (req: Request, res: Response ) => {
  res.send('Hello World')
})

router.post('/login', (req: Request, res: Response ) => {
  res.send('Hello World')
})
