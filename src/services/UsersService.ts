/**
 * Module for the UserService.
 */

import { MongooseServiceBase } from './MongooseServiceBase'
import { UserRepository } from '../repositories/UserRepository'
import { IUser, User } from '../models/user'
import jwt from 'jsonwebtoken'


// This is a service class that extends the MongooseServiceBase class.
export class UsersService extends MongooseServiceBase<IUser> {
  constructor(repository = new UserRepository()) {
    super(repository)
  }

  /**
   * Authenticates a user.
   */
  async authenticate(email: string, password: string): Promise<IUser | null> {
    return (this._repository as UserRepository).authenticate(email, password)   
  }
}
