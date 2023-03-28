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


  async get(req: Request, res: Response, next: NextFunction): Promise<void> {

  }


  async update(req: Request, res: Response, next: NextFunction): Promise<void> {

  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {

  }
}