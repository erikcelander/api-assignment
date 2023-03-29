import mongoose, { Request, Response, NextFunction } from 'express'
import { ExercisesService } from '../services/ExercisesService'
import { IExercise, Exercise } from '../models/exercise'
import { AuthenticatedRequest } from './UsersController'
import createError from 'http-errors'
import { Document } from 'mongoose'


interface ExerciseRequest extends Request {
  exercise?: Document
}


/**
 * Encapsulates a controller.
 */
export class ExerciseController {

  #service: ExercisesService

  constructor(service: ExercisesService) {
    this.#service = service
  }

  /**
   * Provide req.exercise to the route if :id is present.
   */
  async loadExercise(req: ExerciseRequest, res: Response, next: NextFunction, id: string) {
    try {
      // Get the exercise.
      const exercise = await this.#service.getById(id)

      // If no exercise found send a 404 (Not Found).
      if (!exercise) {
        throw createError(404, 'The requested resource was not found.')
      }

      // Provide the exercise to req.
      req.exercise = exercise

      // Next middleware.
      next()
    } catch (error: any) {
      next(error)
    }
  }


  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, description } = req.body
      const { user: { id } } = req as AuthenticatedRequest

      if (!name) {
        throw createError(400, 'Exercise name is required.')
      }

      const exercise = await this.#service.insert({
        name: name.trim() as string,
        description: description?.trim() as string,
        owner: id as string
      } as IExercise)




      res.status(201).json(exercise as IExercise)
    } catch (error: any) {
      error.status = error.name === 'ValidationError' ? 400 : 500
      error.message = error.name === 'ValidationError' ? 'Bad request' : 'Something went wrong'

      next(error)
    }
  }


  async get(req: ExerciseRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      res.json(req.exercise as IExercise)
    } catch (error: any) {
      next(error)
    }
  }


  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const exercises = await this.#service.get()
      res.json(exercises as IExercise[])
    } catch (error) {
      next(error)
    }
  }


  async partiallyUpdate(req: ExerciseRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, description } = req.body

      if (!req.exercise) {
        throw createError(404, 'Exercise not found')
      }

      if (!name && !description) {
        throw createError(400, 'At least one property (name or description) is required for partial updates.')
      }

      const partialExercise: Partial<IExercise> = {}
      if (name) partialExercise.name = name.trim()
      if (description) partialExercise.description = description.trim()

      const updatedExercise = await this.#service.update(req.exercise.id, partialExercise)

      res.json(updatedExercise)
    } catch (err) {
      next(err)
    }
  }


  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, description } = req.body

      const updatedExercise = await this.#service.update(req.params.id, {
        name: name.trim(),
        description: description?.trim(),
      } as IExercise)

      res.json({ exercise: updatedExercise })
    } catch (error: any) {
      error.status = error.name === 'ValidationError' ? 400 : 500
      error.message = error.name === 'ValidationError' ? 'Bad request' : 'Something went wrong'

      next(error)
    }
  }

  /**
   * Deletes the specified exercise.
   */
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.#service.delete(req.params.id)
      res
        .status(204)
        .send('Exercise successfully deleted')
    } catch (error) {
      next(error)
    }
  }
}