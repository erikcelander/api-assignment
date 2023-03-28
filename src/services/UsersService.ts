/**
 * Module for the UserService.
 */

import { MongooseServiceBase } from './MongooseServiceBase'
import { UserRepository } from '../repositories/UserRepository'
import { IUser, User } from '../models/user'
import jwt from 'jsonwebtoken'


/**
 * Encapsulates a user service.
 */
export class UsersService extends MongooseServiceBase<IUser> {
  /**
   * Initializes a new instance.
   */
  constructor(repository = new UserRepository()) {
    super(repository)
  }

  /**
   * Gets a user by email.
   *
   * @param {string} email - The email of the user to get.
   * @returns {Promise<IUser|null>} Promise resolved with the found user or null if not found.
   */
  async getByEmail(email: string): Promise<IUser | null> {
    return (this._repository as UserRepository).getByEmail(email)
  }

  async authenticate(email: string, password: string): Promise<string | null> {
    const user = await (this._repository as UserRepository).authenticate(email, password)
    if (user) {
      const payload = {
        email: user.email,
        id: user._id,
      }
      const accessToken = jwt.sign(payload, Buffer.from(process.env.ACCESS_TOKEN_PRIVATE!, 'base64'), {
        algorithm: 'RS256',
        expiresIn: process.env.ACCESS_TOKEN_LIFE!,
      })


      return accessToken
    }
    return null
  }
}
