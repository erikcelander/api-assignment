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

  async authenticate(email: string, password: string): Promise<IUser | null> {
    return (this._repository as UserRepository).authenticate(email, password)   
  }
}
