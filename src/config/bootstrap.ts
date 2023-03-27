/**
 * Module for bootstrapping.
 *
 * @author Mats Loock
 * @version 2.0.0
 */

import { IoCContainer } from '../util/IoCContainer'
import dotenv from 'dotenv'

import { User } from '../models/user'
import { Exercise } from '../models/exercise'
import { Workout } from '../models/workout'

import { UserRepository } from '../repositories/UserRepository'
import { ExerciseRepository } from '../repositories/ExerciseRepository'
import { WorkoutRepository } from '../repositories/WorkoutRepository'

import { UserService } from '../services/UserService'
import { ExerciseService } from '../services/ExerciseService'
import { WorkoutService } from '../services/WorkoutService'

import { UserController } from '../controllers/UserController'
//import { ExerciseController } from '../controllers/ExerciseController'
//import { WorkoutController } from '../controllers/WorkoutController'

dotenv.config()
const iocContainer = new IoCContainer()

// Register the connection string for the database.
iocContainer.register('ConnectionString', process.env.DB_CONNECTION_STRING)

iocContainer.register('UserType', User, { type: true })
iocContainer.register('ExerciseType', Exercise, { type: true })
iocContainer.register('WorkoutType', Workout, { type: true })


// Register repositories for user, exercise, and workout with their respective model types as dependencies, as singletons.
iocContainer.register('UserRepository', UserRepository, { 
  singleton: true,
  dependencies: ['UserType'] 
})
iocContainer.register('ExerciseRepository', ExerciseRepository, { 
  singleton: true,
  dependencies: ['ExerciseType'] 
 })
iocContainer.register('WorkoutRepository', WorkoutRepository,  { 
  singleton: true,
  dependencies: ['WorkoutType'] 
 })

// Register services for user, exercise, and workout, with their respective repositories as dependencies, as singletons.
iocContainer.register('UserService', UserService, {
  dependencies: ['UserRepository'],
  singleton: true
})
iocContainer.register('ExerciseService', ExerciseService, {
  dependencies: ['ExerciseRepository'],
  singleton: true
})
iocContainer.register('WorkoutService', WorkoutService, {
  dependencies: ['WorkoutRepository'],
  singleton: true
})

// Register controllers for user, exercise, and workout, with their respective services as dependencies, as singletons.
iocContainer.register('UserController', UserController, {
  dependencies: ['UserService'],
  singleton: true
})
/*iocContainer.register('ExerciseController', ExerciseController, {
  dependencies: ['ExerciseService'],
  singleton: true
})
iocContainer.register('WorkoutController', WorkoutController, {
  dependencies: ['WorkoutService'],
  singleton: true
})*/

export const container = Object.freeze(iocContainer)
