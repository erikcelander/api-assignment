/**
 * The user account controller.
 *
 * @author Erik Kroon Celander <ek223ur@student.lnu.se>
 * @version 1.0.0
 */

import { Request, Response, NextFunction } from 'express'
import { WorkoutsService } from '../services/WorkoutsService'
import { Document } from 'mongoose'
import { Workout } from '../models/workout'
import createError from 'http-errors'

interface WorkoutRequest extends Request {
  workout?: Document
}

/**
 * Encapsulates a controller.
 */
export class WorkoutController {

  #service: WorkoutsService

  constructor(service: WorkoutsService) {
    this.#service = service
  }


  async loadWorkout(req: WorkoutRequest, res: Response, next: NextFunction, id: string) {
    try {
      const workout = await this.#service.getById(id)

      if (!workout) {
        next(createError(404, 'The requested resource was not found.'))
        return
      }

      req.workout = workout

      next()
    } catch (error) {
      next(error)
    }
  }


  async create(req: Request, res: Response, next: NextFunction): Promise<void> {

  }

  async get(req: Request, res: Response, next: NextFunction): Promise<void> {

  }


  async update(req: Request, res: Response, next: NextFunction): Promise<void> {

  }

  /**
   * Deletes the specified workout.
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
