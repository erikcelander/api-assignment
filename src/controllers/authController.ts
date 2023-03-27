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
      const { email, password } = req.body
      console.log(req.body)
  
      if (!email || !password) {
        throw new Error('Email and password are required')
      }
  
      const user = new User({ email, password })
      await user.save()
  
      res.status(201).json({ message: 'Registration successful' })
    } catch (error: any) {
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
