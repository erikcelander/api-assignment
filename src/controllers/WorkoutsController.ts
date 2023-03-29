/**
 * The user account controller.
 *
 * @author Erik Kroon Celander <ek223ur@student.lnu.se>
 * @version 1.0.0
 */

import { Request, Response, NextFunction } from 'express'
import { WorkoutsService } from '../services/WorkoutsService'
import { Document } from 'mongoose'
import { IWorkout } from '../models/workout'
import createError from 'http-errors'
import { AuthenticatedRequest } from '../middleware/authJWT'
import { Exercise, IExercise } from '../models/exercise'
import { ExercisesService } from '../services/ExercisesService'

interface WorkoutRequest extends Request {
  workout?: Document
}

/**
 * Encapsulates a controller.
 */
export class WorkoutController {

  #workoutService: WorkoutsService
  #exerciseService: ExercisesService

  constructor(workoutService: WorkoutsService, exerciseService: ExercisesService) {
    this.#workoutService = workoutService
    this.#exerciseService = exerciseService
  }


  async loadWorkout(req: WorkoutRequest, res: Response, next: NextFunction, id: string) {
    try {
      const workout = await this.#workoutService.getById(id)

      if (!workout) {
        throw createError(404, 'The requested resource was not found.')
      }

      req.workout = workout

      next()
    } catch (error: any) {
      next(error)
    }
  }


  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let { name, exercises } = req.body
      const { user: { id } } = req as AuthenticatedRequest

      if (!name) {
        name = name ? name.trim() : `Workout ${await this.#workoutService.getAmountOfWorkouts(id) + 1}`
      }

      const workoutExercises = []

      if (exercises && exercises.length > 0) {
        for (let i = 0; i < exercises.length; i++) {
          const exercise = exercises[i]
          const name = exercise.name ? exercise.name.trim() : `Exercise ${i + 1}`


          const createdExercise = await this.#exerciseService.insert({
            name: name,
            description: exercise.description,
            owner: id
          } as IExercise)

          workoutExercises.push({
            name: name,
            id: createdExercise.id,
            reps: exercise.reps,
            sets: exercise.sets,
            weight: exercise.weight
          })
        }
      }

      const workout = await this.#workoutService.insert({
        name: name.trim(),
        owner: id,
        exercises: workoutExercises
      } as IWorkout)


      res.json(workout)
    } catch (error: any) {
      console.log(error)
      error.status = error.name === 'ValidationError' ? 400 : 500
      error.message = error.name === 'ValidationError' ? 'Bad request' : 'Something went wrong'

      next(error)
    }
  }

  async get(req: WorkoutRequest, res: Response, next: NextFunction): Promise<void> {
    res.json(req.workout as IWorkout)
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const workouts = await this.#workoutService.get()
      workouts.length === 0 ? res.json({ message: 'No workouts found' }) : res.json(workouts as IWorkout[])
    } catch (error) {
      next(error)
    }
  }

  async partiallyUpdate(req: WorkoutRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name } = req.body

      if (!req.workout) {
        throw createError(404, 'Workout not found')
      }

      if (!name) {
        throw createError(400, 'At least one property (name) is required for partial updates.')
      }

      const partialWorkout: Partial<IWorkout> = {}
      if (name) partialWorkout.name = name.trim()

      const updatedWorkout = await this.#workoutService.update(req.workout.id, partialWorkout)

      res.json({ workout: updatedWorkout })
    } catch (err) {
      next(err)
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name } = req.body

      const updatedWorkout = await this.#workoutService.update(req.params.id, {
        name: name.trim(),
      } as IWorkout)

      res.json({ workout: updatedWorkout })
    } catch (error: any) {
      error.status = error.name === 'ValidationError' ? 400 : 500
      error.message = error.name === 'ValidationError' ? 'Bad request' : 'Something went wrong'

      next(error)
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.#workoutService.delete(req.params.id)
      res
        .status(204)
        .send('Workout successfully deleted')
    } catch (error) {
      next(error)
    }
  }
}
