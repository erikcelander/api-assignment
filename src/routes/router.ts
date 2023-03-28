import express, { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'
import { router as v1Router } from './api/v1/router'


  export const router = express.Router()

  router.use('/api/v1', v1Router)

  // Catch 404 (ALWAYS keep this as the last route).
  router.use('*', (req: Request, res: Response, next: NextFunction) => next(createError(404)))
