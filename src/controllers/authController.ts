/**
 * The user account controller.
 *
 * @author Erik Kroon Celander <ek223ur@student.lnu.se>
 * @version 1.0.0
 */

import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { User } from '../models/user'

/**
 * Encapsulates a controller.
 */
export class AuthController {
  /**
   * Creates a new account.
   *
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   * @param {NextFunction} next - Express next middleware function.
   */
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = new User({
        password: req.body.password,
        email: req.body.email,
      })
      await user.save()
      res.status(201).json({ id: user.id })
    } catch (error) {
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

        const accessToken = jwt.sign(payload, Buffer.from(process.env.ACCESS_TOKEN_SECRET!, 'base64'), {
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
