/**
 * Module for bootstrapping.
 *
 * @author Erik Kroon Celander
 * @version 1.0.0
 */

import { IoCContainer } from '../util/IoCContainer'
import dotenv from 'dotenv'

import { User } from '../models/user'
import { Exercise } from '../models/exercise'
import { Workout } from '../models/workout'

import { UserRepository } from '../repositories/UserRepository'
import { ExerciseRepository } from '../repositories/ExerciseRepository'
import { WorkoutRepository } from '../repositories/WorkoutRepository'
import { WebhookRepository } from '../repositories/WebhookRepository'

import { UsersService } from '../services/UsersService'
import { ExercisesService } from '../services/ExercisesService'
import { WorkoutsService } from '../services/WorkoutsService'
import { WebhooksService } from '../services/WebhooksService'

import { UsersController } from '../controllers/UsersController'
import { ExercisesController } from '../controllers/ExercisesController'
import { WorkoutsController } from '../controllers/WorkoutsController'
import { WebhooksController } from '../controllers/WebhooksController'
import { Webhook } from '../models/webhook'

dotenv.config()
const iocContainer = new IoCContainer()

// Register the connection string for the database.
iocContainer.register('ConnectionString', process.env.DB_CONNECTION_STRING)

// Register model types for user, exercise, and workout.

iocContainer.register('UserType', User, { type: true })
iocContainer.register('ExerciseType', Exercise, { type: true })
iocContainer.register('WorkoutType', Workout, { type: true })
iocContainer.register('WebhookType', Webhook, { type: true })


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
iocContainer.register('WebhookRepository', WebhookRepository,  {
  singleton: true,
  dependencies: ['WebhookType']
})

// Register services for user, exercise, and workout, with their respective repositories as dependencies, as singletons.
iocContainer.register('UserService', UsersService, {
  dependencies: ['UserRepository'],
  singleton: true
})
iocContainer.register('ExerciseService', ExercisesService, {
  dependencies: ['ExerciseRepository'],
  singleton: true
})
iocContainer.register('WorkoutService', WorkoutsService, {
  dependencies: ['WorkoutRepository'],
  singleton: true
})
iocContainer.register('WebhookService', WebhooksService, {
  dependencies: ['WebhookRepository'],
  singleton: true
})

// Register controllers for user, exercise, and workout, with their respective services as dependencies, as singletons.
iocContainer.register('UsersController', UsersController, {
  dependencies: ['UserService'],
  singleton: true
})
iocContainer.register('ExercisesController', ExercisesController, {
  dependencies: ['ExerciseService'],
  singleton: true
})
iocContainer.register('WorkoutsController', WorkoutsController, {
  dependencies: ['WorkoutService', 'ExerciseService'],
  singleton: true
})
iocContainer.register('WebhooksController', WebhooksController, {
  dependencies: ['WebhookService'],
  singleton: true
})

export const container = Object.freeze(iocContainer)
