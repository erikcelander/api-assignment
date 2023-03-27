/**
 * The user account controller.
 *
 * @author Erik Kroon Celander <ek223ur@student.lnu.se>
 * @version 1.0.0
 */

import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { User, IUser } from '../models/user'
import { UserService } from '../services/UserService'


/**
 * Encapsulates a controller.
 */
export class UserController {

  #service: UserService

  constructor(service: UserService) {
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
      const user = await this.#service.insert({
        email: req.body.email,
        password: req.body.password
      } as IUser)

      res.status(201).json({ message: 'Registration successful', user })
    } catch (error: any) {
      error.status = 400
      next(error)
    }
  }


  /**
   * Logs in the user and returns an access token.
   *
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   * @param {NextFunction} next - Express next middleware function.
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      const user = await User.authenticate(req.body.email, req.body.password) ?? null

      if (user) {

        const payload = {
          email: user.email,
          id: user._id,
        }

        const accessToken = jwt.sign(payload, Buffer.from(process.env.ACCESS_TOKEN_PRIVATE!, 'base64'), {
          algorithm: 'RS256',
          expiresIn: process.env.ACCESS_TOKEN_LIFE!,
        })

        res.status(201).json({ access_token: accessToken })
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error: any) {
      error.status = 401
      next(error)
    }
  }
}
