/**
 * The user account controller.
 *
 * @author Erik Kroon Celander <ek223ur@student.lnu.se>
 * @version 1.0.0
 */

import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { IUser } from '../models/user'
import { UsersService } from '../services/UsersService'
import createError from 'http-errors'
import { generateResourceLinks } from '../config/hateoas'

export interface AuthenticatedRequest extends Request {
  user: {
    email: string
    id: string
  }
}

/**
 * Encapsulates a controller.
 */
export class UsersController {

  #service: UsersService

  constructor(service: UsersService) {
    this.#service = service
  }
  /**
   * Creates a new account.
   *
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   * @param {NextFunction} next - Express next middleware function.
   */
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        throw createError(400, 'Email and password are required for registration.')
      }

      const user = await this.#service.insert({
        email,
        password,
      } as IUser)

      const links = generateResourceLinks('auth', '', 'login')

      res.status(201).json({ 
        message: `User ${user.email} successfully created.`,
        _links: links
     })
    } catch (error: any) {
      error.status = 400
      next(error)
    }
  }


  /**
   * Logs in the user and returns an access token.
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        throw createError(400, 'Email and password are required for login.')
      }

      const user = await this.#service.authenticate(email, password)

      const payload = {
        email: user?.email,
        id: user?._id,
      }

      const accessToken = jwt.sign(payload, Buffer.from(process.env.ACCESS_TOKEN_PRIVATE!, 'base64'), {
        algorithm: 'RS256',
        expiresIn: process.env.ACCESS_TOKEN_LIFE!,
      })


      res.status(200).json({ 
        access_token: accessToken,
        _links: [
          { rel: 'getWorkouts', href: '/api/v1/workouts', method: 'GET' },
          { rel: 'createWorkout', href: `/api/v1/workouts`, method: 'POST' },
          { rel: 'getExercises', href: '/api/v1/exercises', method: 'GET' },
          { rel: 'createExercise', href: '/api/v1/exercises', method: 'POST' },
        ]
       })

    } catch (error: any) {
      error.status = 401
      error.message = 'Invalid email or password.'
      next(error)
    }
  }

   /**
     * Authenticates requests.
     *
     * If authentication is successful, `req.user`is populated and the
     * request is authorized to continue.
     * If authentication fails, an unauthorized response will be sent.
     */
  async authenticateJWT(req: Request, res: Response, next: NextFunction) {
    try {
      const [authenticationScheme, token] = (req.headers.authorization?.split(' ') ?? []) as [string, string]

      if (authenticationScheme !== 'Bearer') {
        throw new Error('Invalid authentication scheme. Authorization header must start with "Bearer"')
      }

      const payload = jwt.verify(token, Buffer.from(process.env.ACCESS_TOKEN_PUBLIC!, 'base64'))

      if (typeof payload !== 'object' || payload === null || !('email' in payload) || !('id' in payload)) {
        throw new Error('Invalid payload. Payload must contain "email" and "id" properties.')
      }

      (req as AuthenticatedRequest).user = {
        email: payload.email,
        id: payload.id,
      }

      next()
    } catch (err: any) {
      err.message = 'Access token invalid or expired.'
      err.status = 401
      next(err)
    }
  }
}
