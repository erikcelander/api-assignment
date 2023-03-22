/**
 * The starting point of the application.
 *
 * @author Erik Kroon Celander
 * @version 1.0.0
 */

import { container } from './config/bootstrap'
import express, { Request, Response, NextFunction, Express } from 'express'
import helmet from 'helmet'
import logger from 'morgan'
import createError, { HttpError } from 'http-errors'
import { router } from './routes/router'
import { connectDB } from './config/mongoose'

const PORT: number = parseInt(process.env.PORT || '3000')

async function startServer(): Promise<void> {
  try {
    const connectionString: string = container.resolve('ConnectionString')
    await connectDB(connectionString)

    const app: Express = express()

    app.set('container', container)

    // Set various HTTP headers to make the application little more secure (https://www.npmjs.com/package/helmet).
    app.use(helmet())

    // Set up a morgan logger using the dev format for log entries.
    app.use(logger('dev'))

    // Parse requests of the content type application/json.
    app.use(express.json())

    // Register routes.
    app.use('/', router)

    // Error handler.
    app.use(function (err: HttpError, req: Request, res: Response, next: NextFunction) {
      if (!err.status) {
        const cause = err
        err = createError(500)
        err.cause = cause
      }

      if (req.app.get('env') !== 'development') {
        return res
          .status(err.status)
          .json({
            status: err.status,
            message: err.message,
          })
      }

      // Development only!
      // Only providing detailed error in development.
      return res
        .status(err.status)
        .json({
          status: err.status,
          message: err.message,
          cause: err.cause ? JSON.stringify(err.cause, Object.getOwnPropertyNames(err.cause)) : undefined,
          stack: err.stack,
        })
    })

    // Starts the HTTP server listening for connections.
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`)
      console.log('Press Ctrl-C to terminate...')
    })
  } catch (err: unknown) {
    console.error(err)
    process.exitCode = 1
  }
}

startServer()
