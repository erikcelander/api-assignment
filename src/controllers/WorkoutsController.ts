/**
 * The user account controller.
 *
 * @author Erik Kroon Celander <ek223ur@student.lnu.se>
 * @version 1.0.0
 */

import { Request, Response, NextFunction } from 'express'
import { WorkoutsService } from '../services/WorkoutsService'
import { IWorkout } from '../models/workout'
import createError from 'http-errors'
import { AuthenticatedRequest } from './UsersController'
import { IExercise } from '../models/exercise'
import { ExercisesService } from '../services/ExercisesService'

interface WorkoutRequest extends Request {
  workout?: IWorkout
}

type ExerciseData = {
  name: string
  id: string
  reps: number
  sets: number
  weight: number
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

      if (!workout || workout.owner !== (req as AuthenticatedRequest).user.id) {
        throw createError(404, 'The requested resource was either not found or you have no permission to access it.')
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
        name = name ? name.trim() : `Workout ${(await this.#workoutService.get({ owner: (req as AuthenticatedRequest).user.id })).length + 1}`
      }

      const workoutExercises = []

      if (exercises && exercises.length > 0) {
        for (let i = 0; i < exercises.length; i++) {
          const exercise = exercises[i]
          const name = exercise.name ? exercise.name.trim() : `Exercise ${((await this.#exerciseService.get({ owner: (req as AuthenticatedRequest).user.id })).length + 1)}`


          const createdExercise = await this.#exerciseService.insert({
            name: name,
            description: exercise.description,
            owner: id
          } as IExercise)

          workoutExercises.push({
            name: name,
            reps: exercise.reps,
            sets: exercise.sets,
            weight: exercise.weight,
            id: createdExercise.id
          })
        }
      }

      const workout = await this.#workoutService.insert({
        name: name,
        owner: id,
        exercises: workoutExercises
      } as IWorkout)


      res.status(201).json(workout)
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
      const workouts = await this.#workoutService.get({ owner: (req as AuthenticatedRequest).user.id })
      workouts.length === 0 ? res.json({ message: 'No workouts found' }) : res.json({ workouts: workouts as IWorkout[] })
    } catch (error) {
      next(error)
    }
  }

  async partiallyUpdate(req: WorkoutRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, exercises } = req.body


      if (!req.workout) {
        throw createError(404, 'Workout not found')
      }

      if (!name) {
        throw createError(400, 'At least one property (name) is required for partial updates.')
      }

      const partialWorkout: Partial<IWorkout> = {}
      if (name) partialWorkout.name = name.trim()
      if (exercises) partialWorkout.exercises = exercises


      const updatedWorkout = await this.#workoutService.update(req.workout.id, partialWorkout)

      res.json({ workout: updatedWorkout })
    } catch (error: any) {
      console.log(error)
      error.status = error.name === "ValidationError" ? 400 : 500
      error.message = error.name === "ValidationError" ? "Bad request" : "Something went wrong"

      next(error)
    }
  }

 

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, exercises } = req.body
      const { user } = req
      const updateData: Partial<IWorkout> = {}

      if (name) updateData.name = name.trim()

      if (exercises) {
        const exerciseDataPromises = exercises.map(async (exercise: Partial<IExercise>) => await this.processExercise(user, exercise))
        updateData.exercises = await Promise.all(exerciseDataPromises)
      }

      const updatedWorkout = await this.#workoutService.update(req.params.id, updateData)
      res.json({ workout: updatedWorkout })
    } catch (error: any) {
      console.log(error)
      error.status = error.name === 'ValidationError' ? 400 : 500
      error.message = error.name === 'ValidationError' ? 'Bad request' : 'Something went wrong'

      next(error)
    }
  }


  // fixa så att put och patch funkar klockrent och att det inte går att skicka in tomma värden
  // async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  //   try {
  //     const { name, exercises } = req.body
  //     const { user } = req
  //     const updateData: Partial<IWorkout> = {}

  //     if (name) updateData.name = name.trim()

  //     if (exercises) {
  //       const exerciseData: { name: string; id: any; reps: any; sets: any; weight: any }[] = []

  //       await Promise.all(exercises.map(async (exercise: any) => {
  //         if (!exercise.name) {
  //           throw new Error('Invalid name')
  //         }
  //         if (!Number.isFinite(exercise.reps) || exercise.reps <= 0) {
  //           throw new Error('Invalid reps')
  //         }
  //         if (!Number.isFinite(exercise.sets) || exercise.sets <= 0) {
  //           throw new Error('Invalid sets')
  //         }
  //         if (!Number.isFinite(exercise.weight) || exercise.weight <= 0) {
  //           throw new Error('Invalid weight')
  //         } else {

  //           let existingExercise = await this.#exerciseService.getOne({ owner: user.id, name: exercise.name.trim() })

  //           if (existingExercise) {
  //             // An exercise with the same name exists for the user, use that exercise
  //             exerciseData.push({
  //               name: existingExercise.name,
  //               id: existingExercise.id,
  //               reps: exercise.reps,
  //               sets: exercise.sets,
  //               weight: exercise.weight
  //             })

  //           } else {
  //             // No exercise with the same name exists for the user, create a new exercise
  //             const createdExercise = await this.#exerciseService.insert({
  //               name: exercise.name.trim(),
  //               description: exercise.description,
  //               owner: user.id
  //             } as IExercise)

  //             exerciseData.push({
  //               name: createdExercise.name,
  //               id: createdExercise.id,
  //               reps: exercise.reps,
  //               sets: exercise.sets,
  //               weight: exercise.weight
  //             })
  //           }
  //         }
  //       }))

  //       updateData.exercises = exerciseData
  //     }

  //     const updatedWorkout = await this.#workoutService.update(req.params.id, updateData)
  //     res.json({ workout: updatedWorkout })
  //   } catch (error: any) {
  //     console.log(error)
  //     error.status = error.name === "ValidationError" ? 400 : 500
  //     error.message = error.name === "ValidationError" ? "Bad request" : "Something went wrong"

  //     next(error)
  //   }
  // }


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

  async processExercise(user: any, exercise: any): Promise<ExerciseData> {
    if (!exercise.name) {
      throw new Error('Invalid name')
    }
    if (!Number.isFinite(exercise.reps) || exercise.reps <= 0) {
      throw new Error('Invalid reps')
    }
    if (!Number.isFinite(exercise.sets) || exercise.sets <= 0) {
      throw new Error('Invalid sets')
    }
    if (!Number.isFinite(exercise.weight) || exercise.weight <= 0) {
      throw new Error('Invalid weight')
    }

    let existingExercise = await this.#exerciseService.getOne({ owner: user.id, name: exercise.name.trim() })

    if (existingExercise) {
      return {
        name: existingExercise.name,
        id: existingExercise.id,
        reps: exercise.reps,
        sets: exercise.sets,
        weight: exercise.weight,
      }
    } else {
      const createdExercise = await this.#exerciseService.insert({
        name: exercise.name.trim(),
        description: exercise.description,
        owner: user.id,
      } as IExercise)

      return {
        name: createdExercise.name,
        id: createdExercise.id,
        reps: exercise.reps,
        sets: exercise.sets,
        weight: exercise.weight,
      }
    }
  }
}
