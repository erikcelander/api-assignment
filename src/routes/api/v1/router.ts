import express, { Request, Response, NextFunction } from 'express'
import { router as workoutRouter } from './workoutRouter'


export const router = express.Router()

router.use('/workout', workoutRouter)


