/**
 * Module for the UserRepository.
 */

import { MongooseRepositoryBase } from './MongooseRepositoryBase.js'
import { IUser, User } from '../models/user'

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

  /**
   * Gets a user by email.
   */
  async getByEmail(email: string): Promise<IUser | null> {
    return this.model.findOne({ email }).exec()
  }
}
