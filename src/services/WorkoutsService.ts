import { MongooseServiceBase } from './MongooseServiceBase'
import { WorkoutRepository } from '../repositories/WorkoutRepository'
import { IWorkout } from '../models/workout'

// This is a service class that extends the MongooseServiceBase class.
export class WorkoutsService extends MongooseServiceBase<IWorkout> {
  constructor(repository = new WorkoutRepository()) {
    super(repository)
  }
}
