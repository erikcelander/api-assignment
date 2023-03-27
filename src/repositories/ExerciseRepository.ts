import { MongooseRepositoryBase } from './MongooseRepositoryBase'
import { Exercise, IExercise, IExerciseModel } from '../models/exercise'

export class ExerciseRepository extends MongooseRepositoryBase<IExercise> {
  constructor(model: IExerciseModel = Exercise) {
    super(model)
  }
}
