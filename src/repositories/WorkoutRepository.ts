import { MongooseRepositoryBase } from './MongooseRepositoryBase'
import { IExercise } from '../models/exercise'
import { Workout, IWorkout } from '../models/workout'

interface IWorkoutPopulated extends Omit<IWorkout, 'exercises'> {
  exercises: Array<{
    exercise: IExercise
    reps: number
    sets: number
    weight: number
  }>
}

export class WorkoutRepository extends MongooseRepositoryBase<IWorkout> {
  constructor(model = Workout) {
    super(model)
  }
  
  async getByIdPopulated(id: string): Promise<IWorkoutPopulated> {
    try {
      const workout = await this.model.findById(id).populate('exercises.exercise').exec()
  
      if (!workout) {
        throw new Error(`Workout with id ${id} not found.`)
      }
  
      const populatedWorkout = workout.toJSON() as IWorkoutPopulated
      
      populatedWorkout.exercises = populatedWorkout.exercises.map((exercise: any) => {
        return {
          exercise: exercise.exercise,
          reps: exercise.reps,
          sets: exercise.sets,
          weight: exercise.weight,
        }
      })
  
      return populatedWorkout
    } catch (err: any) {
      throw new Error(`Failed to get populated workout with id ${id}: ${err.message}`)
    }
  }  
}
