import { MongooseServiceBase } from './MongooseServiceBase'
import { WorkoutRepository } from '../repositories/WorkoutRepository'
import { IWorkout } from '../models/workout'

export class WorkoutsService extends MongooseServiceBase<IWorkout> {
  constructor(repository = new WorkoutRepository()) {
    super(repository)
  }

  async getAmountOfWorkouts(id: string): Promise<number> {
    return (this._repository as WorkoutRepository).getAmountOfWorkouts(id)
  }
}
