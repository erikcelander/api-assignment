import { MongooseServiceBase } from './MongooseServiceBase'
import { ExerciseRepository } from '../repositories/ExerciseRepository'
import { IExercise } from '../models/exercise'

export class ExercisesService extends MongooseServiceBase<IExercise> {
  constructor(repository = new ExerciseRepository()) {
    super(repository)
  }
}
