import { MongooseServiceBase } from './MongooseServiceBase'
import { ExerciseRepository } from '../repositories/ExerciseRepository'
import { IExercise } from '../models/exercise'

// This is a service class that extends the MongooseServiceBase class.
export class ExercisesService extends MongooseServiceBase<IExercise> {
  constructor(repository = new ExerciseRepository()) {
    super(repository)
  }
}
