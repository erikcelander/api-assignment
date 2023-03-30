/**
 * Module for the UserRepository.
 */

import { MongooseRepositoryBase } from './MongooseRepositoryBase'
import { IUser, User } from '../models/user'
import jwt from 'jsonwebtoken'

/**
 * Encapsulates a user repository.
 */
export class UserRepository extends MongooseRepositoryBase<IUser> {
  /**
   * Initializes a new instance.
   */
  constructor(model = User) {
    super(model)
  }

  async authenticate(email: string, password: string): Promise<IUser | null> {
    return User.authenticate(email, password)
  }
}
