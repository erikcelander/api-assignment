import { MongooseRepositoryBase } from './MongooseRepositoryBase'
import { IExercise } from '../models/exercise'
import { Workout, IWorkout } from '../models/workout'

export class WorkoutRepository extends MongooseRepositoryBase<IWorkout> {
  constructor(model = Workout) {
    super(model)
  }
}
