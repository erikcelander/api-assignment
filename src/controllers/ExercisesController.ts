import mongoose, { Request, Response, NextFunction } from 'express'
import { ExercisesService } from '../services/ExercisesService'
import { IExercise, Exercise } from '../models/exercise'
import { AuthenticatedRequest } from '../middleware/authJWT'
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
        next(createError(404, 'The requested resource was not found.'))
        return
      }

      // Provide the exercise to req.
      req.exercise = exercise

      // Next middleware.
      next()
    } catch (error) {
      next(error)
    }
  }


  async add(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, description } = req.body
      const { user: { id } } = req as AuthenticatedRequest

      if (!name) {
        throw new Error('Exercise name is required.')
      }

      const exercise = await this.#service.insert({
        name: name.trim() as string,
        description: description?.trim() as string,
        owner: id as string
      } as IExercise)




      res.status(201).json(exercise as IExercise)
    } catch (err) {
      next(err)
    }
  }


  async get(req: ExerciseRequest, res: Response, next: NextFunction): Promise<void> {
    res.json(req.exercise as IExercise)
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

      res.json({ exercise: updatedExercise })
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
      const err = createError(error.name === 'ValidationError'
        ? 400 // bad format
        : 500 // something went really wrong
      )
      err.cause = error

      next(err)
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
        .end()
    } catch (error) {
      next(error)
    }
  }
}