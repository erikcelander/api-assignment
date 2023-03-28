import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthenticatedRequest extends Request {
  user: {
    email: string
    id: string
  }
}

/**
   * Authenticates requests.
   *
   * If authentication is successful, `req.user`is populated and the
   * request is authorized to continue.
   * If authentication fails, an unauthorized response will be sent.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
export async function authenticateJWT(req: Request, res: Response, next: NextFunction) {
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



