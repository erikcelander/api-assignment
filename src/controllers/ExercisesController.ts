import { Request, Response, NextFunction } from 'express'
import { ExercisesService } from '../services/ExercisesService'
import { Exercise } from '../models/exercise'


/**
 * Encapsulates a controller.
 */
export class ExerciseController {

  #service: ExercisesService

  constructor(service: ExercisesService) {
    this.#service = service
  }

  async add(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, description } = req.body

      if (!name) {
        throw new Error('Exercise name is required.')
      }

      const exercise = await Exercise.create({
        name: name.trim(),
        description: description?.trim(),
      })

      res.status(201).json({ exercise })
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