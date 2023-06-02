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
import { generateResourceLinks } from '../config/hateoas'

interface WorkoutRequest extends Request {
  workout?: IWorkout
}

type ExerciseData = {
  name: string
  id: string
  reps: number
  sets: number
  weight: number
  description?: string
}

type UserData = {
  id: string
  email: string
}


/**
 * Encapsulates a controller.
 */
export class WorkoutsController {

  #workoutService: WorkoutsService
  #exerciseService: ExercisesService

  constructor(workoutService: WorkoutsService, exerciseService: ExercisesService) {
    this.#workoutService = workoutService
    this.#exerciseService = exerciseService
  }


  /**
   * Middleware that populates req.workout with a workout.
   */
  async loadWorkout(req: Request, res: Response, next: NextFunction, id: string) {
    try {

      const workout = await this.#workoutService.getById(id)

      if (!workout || workout.owner !== (req as AuthenticatedRequest).user.id) {
        throw createError(404, 'The requested resource was either not found or you have no permission to access it.')
      }

      (req as WorkoutRequest).workout = workout as IWorkout

      next()
    } catch (error: any) {
      next(error)
    }
  }

  /**
   * Creates a new workout.
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let { name, exercises } = req.body
      const { user: { id } } = req as AuthenticatedRequest


      name = name ? name.trim() : `Workout ${(await this.#workoutService.get({ owner: id })).length + 1}`

      const workoutExercises: ExerciseData[] = []

      if (exercises && exercises.length > 0) {
        for (let i = 0; i < exercises.length; i++) {
          const exercise = exercises[i]

          const name = exercise.name ? exercise.name.trim() : `Exercise ${((await this.#exerciseService.get({ owner: (req as AuthenticatedRequest).user.id })).length + 1)}`

          const createdExercise = await this.#exerciseService.insert({
            name: name,
            description: exercise?.description,
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

      const links = generateResourceLinks('workout', workout.id, 'single')
      res.status(201).json({
        ...workout.toObject(),
        _links: links
      }).end()

      return next()

    } catch (error: any) {
      error.status = error.name === 'ValidationError' ? 400 : 500
      error.message = error.name === 'ValidationError' ? 'Bad request' : 'Something went wrong'

      next(error)
    }
  }

  async get(req: WorkoutRequest, res: Response, next: NextFunction): Promise<void> {
    const links = generateResourceLinks('workout', req.workout?.id as string, 'single')
    res.status(200).json({
      ...req.workout?.toObject(),
      _links: links
    })
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const workouts = await this.#workoutService.get({ owner: (req as AuthenticatedRequest).user.id })
      const links = generateResourceLinks('workout', '', 'all')
      workouts.length === 0 ? res.status(200).json({ message: 'No workouts found', _links: links }) : res.status(200).json({ workouts: workouts as IWorkout[], _links: links })
    } catch (error: any) {
      error.status = 500
      error.message = 'Something went wrong'
      next(error)
    }
  }

  /**
   * Partially updates a workout.
   */
  async partiallyUpdate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, exercises } = req.body
      const { user } = req as AuthenticatedRequest

      let { workout } = req as WorkoutRequest
      workout = workout?.toObject() as IWorkout

      if (!name && !exercises) {
        throw createError(400, 'At least one property (name or exercises) is required for partial updates.')
      }

      if (name) {
        workout.name = name.trim()
      }

      if (exercises) {
        for (const [index, exerciseData] of exercises.entries()) {

          try {

            const exerciseNumber: number = index + 1
            const updatedExercise = await this.patchExerciseForWorkout(workout as IWorkout, user, exerciseData, exerciseNumber)

            if (updatedExercise) {
              const existingExerciseIndex = workout.exercises.findIndex((exercise) => exercise.id === updatedExercise.id)
              if (existingExerciseIndex !== -1) {
                workout.exercises[existingExerciseIndex] = updatedExercise
              } else {
                workout.exercises.push(updatedExercise)
              }
            }


          } catch (error: any) {
            if (error.name === 'BadRequestError') {
              error.status = 400
              error.message = `Exercise ${index + 1}: ${error.message}`
            }

            throw error
          }
        }
      }

      const { id, ...workoutWithoutId } = workout
      const updatedWorkout = await this.#workoutService.update(id, workoutWithoutId)


      if (!updatedWorkout) {
        throw createError(404, `Could not find workout with id ${id}`)
      }

      const links = generateResourceLinks('workout', id, 'single')
      res.status(200).json({ ...updatedWorkout.toObject(), _links: links })

    } catch (error: any) {
      if (!error.status) {
        error.status = error.name === 'ValidationError' ? 400 : 500
        error.message = error.name === 'ValidationError' ? 'Bad Request' : 'Something went wrong'
      }

      next(error)
    }
  }

  /**
   * Updates an exercise for a workout.
   */
  async patchExerciseForWorkout(workout: IWorkout, user: UserData, exerciseData: Partial<ExerciseData>, exerciseNumber: number): Promise<ExerciseData> {

    const { id, name, reps, sets, weight, description } = exerciseData

    if (!name && !reps && !sets && !weight) {
      throw createError(400, 'At least one property (name, reps, sets or weight) is required for partial updates.')
    }

    let existingExercise = workout.exercises.find((exercise) => exercise.id === id)

    if (!existingExercise && !id && name) {
      existingExercise = workout.exercises.find((exercise) => exercise.name === name)
      if (existingExercise) {
        exerciseData.id = existingExercise.id
      }
    }

    let exercise = {} as ExerciseData

    if (existingExercise) {
      exercise = { ...existingExercise, ...exerciseData }
      if (name && name !== existingExercise.name) {
        const updatedExercise = await this.#exerciseService.update(id!, {
          name: name.trim(),
          description: description?.trim(),
          owner: user.id
        })
        exercise.name = updatedExercise ? updatedExercise.name : name
      }
    } else if (reps && sets && weight) {
      const createdExercise = await this.#exerciseService.insert({
        name: exerciseData.name ? exerciseData.name.trim() : `Exercise ${(await this.#exerciseService.get({ owner: user.id })).length + 1}`,
        description: exerciseData?.description,
        owner: user.id,
      } as IExercise)

      exercise = {
        id: createdExercise.id,
        name: createdExercise.name,
        reps,
        sets,
        weight,
      } as ExerciseData
    } else {
      throw createError(400, `Invalid exercise data for exercise #${exerciseNumber} in request body`)
    }
    return exercise
  }

  /**
   * Updates a workout
   */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let { name, exercises } = req.body
      const { user } = req as AuthenticatedRequest
      let { workout } = req as WorkoutRequest
      workout = workout?.toObject() as IWorkout

      workout.name = name ? name.trim() : workout.name

      if (!exercises) {
        throw createError(400, 'Bad request.')
      }

      if (exercises && exercises.length > 0 && workout) {
        exercises = exercises.map((exerciseData: ExerciseData, index: number) => this.processExerciseForWorkout(workout as IWorkout, user, exerciseData))
        workout.exercises = await Promise.all(exercises)
      }

      const { id, ...workoutWithoutId } = workout

      const updatedWorkout = await this.#workoutService.update(id, workoutWithoutId)

      const links = generateResourceLinks('workout', id, 'single')

      res.status(200).json({ workout: updatedWorkout, _links: links })
    } catch (error: any) {
      error.status = error.name === 'ValidationError' ? 400 : 500
      error.message = error.name === 'ValidationError' ? 'Bad request' : 'Something went wrong'

      next(error)
    }
  }

  /**
   * Processes an exercise for a workout
   */
  async processExerciseForWorkout(workout: IWorkout, user: UserData, exerciseData: ExerciseData): Promise<ExerciseData> {

    let { id, name, reps, sets, weight, description } = exerciseData

    if ((!name && !id) || !sets || !reps || !weight) {
      throw createError(400, 'One identifier (id or name) and all properties (sets, reps, and weight) are required for full exercise updates.')
    }

    let existingExercise = workout.exercises.find((currentExercise: any) => currentExercise.id === id)

    if (!existingExercise && !id && name) {
      existingExercise = workout.exercises.find((currentExercise) => currentExercise.name === name)
      if (existingExercise) {
        id = existingExercise.id
      }
    }


    let exercise = {} as ExerciseData

    if (existingExercise && name?.trim().toLowerCase() !== existingExercise?.name?.trim().toLowerCase()) {
      const updatedExercise = await this.#exerciseService.update(id!, {
        name: name,
        owner: user.id
      })


      if (!updatedExercise) {
        throw createError(500, 'Something went wrong while updating the exercise.')
      }


      exercise = {
        id: updatedExercise.id,
        name: updatedExercise.name,
        sets: sets,
        reps: reps,
        weight: weight
      }

    } else {

      const createdExercise = await this.#exerciseService.insert({
        name: name.trim(),
        description: description?.trim(),
        owner: user.id,
      } as IExercise)

      exercise = {
        id: createdExercise.id,
        name: createdExercise.name,
        sets: sets,
        reps: reps,
        weight: weight
      }
    }
    return exercise
  }

  /**
   * Deletes a workout.
   */
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


  /* isNumberValid(value: number | undefined): boolean {
     return value !== undefined && Number.isFinite(value) && value > 0
   }
 
   validateExerciseData(exerciseData: ExerciseData, exerciseNumber: number): void {
     if (!this.isNumberValid(exerciseData.reps)) {
       throw new Error(`Invalid reps for exercise ${exerciseNumber}`)
     }
     if (!this.isNumberValid(exerciseData.sets)) {
       throw new Error(`Invalid sets for exercise ${exerciseNumber}`)
     }
     if (!this.isNumberValid(exerciseData.weight)) {
       throw new Error(`Invalid weight for exercise ${exerciseNumber}`)
     }
   }*/


   /**
    * Adds an exercise to a workout. If the exercise does not exist, it will be created.
  async addExerciseToWorkout(req: WorkoutRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      let workout = req.workout as IWorkout
      const newExercise = req.body

      if (!newExercise || !newExercise.name || !newExercise.reps || !newExercise.sets || !newExercise.weight) {
        throw createError(400, 'Exercise data is required to add an exercise.')
      }

      // Create the new exercise through the exercise service
      const createdExercise = await this.#exerciseService.insert({
        name: newExercise.name.trim(),
        description: newExercise.description?.trim(),
        owner: (req as AuthenticatedRequest).user.id,
      } as IExercise)

      // Add the new exercise to the workout
      workout.exercises.push({
        id: createdExercise.id,
        name: createdExercise.name,
        reps: newExercise.reps,
        sets: newExercise.sets,
        weight: newExercise.weight,
      })

      const updatedWorkout = await this.#workoutService.update(req.params.id, workout)
      const links = generateResourceLinks('workout', req.params.id, 'single')
      res.status(201).json({ workout: updatedWorkout, links })

    } catch (error: any) {
      error.status = error.name === 'ValidationError' ? 400 : 500
      error.message = error.name === 'ValidationError' ? 'Bad request' : 'Something went wrong'

      next(error)
    }
  }*/
}
