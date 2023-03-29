import { MongooseRepositoryBase } from './MongooseRepositoryBase'
import { IExercise } from '../models/exercise'
import { Workout, IWorkout } from '../models/workout'

export class WorkoutRepository extends MongooseRepositoryBase<IWorkout> {
  constructor(model = Workout) {
    super(model)
  }


  async getAmountOfWorkouts(id: string): Promise<number> {
    try {
      const workouts = await this.get({ owner: id })

      return workouts.length
    } catch (err: any) {
      err.message = `Failed to get amount of workouts: ${err.message}`
      err.status = 500
      throw err
    }
  }
}
