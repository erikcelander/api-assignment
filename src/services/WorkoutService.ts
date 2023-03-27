import { MongooseServiceBase } from './MongooseServiceBase'
import { WorkoutRepository } from '../repositories/WorkoutRepository'
import { IWorkout } from '../models/workout'

export class WorkoutService extends MongooseServiceBase<IWorkout> {
  constructor(repository = new WorkoutRepository()) {
    super(repository)
  }
}
