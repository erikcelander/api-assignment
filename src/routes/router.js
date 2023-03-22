import express from 'express'
import createError from 'http-errors'
//import { router as v1Router } from './api/v1/router.js'

export const router = express.Router()

router.use('/api/hello', (req, res) => res.send('Hello World!'))

// Catch 404 (ALWAYS keep this as the last route).
router.use('*', (req, res, next) => next(createError(404)))
