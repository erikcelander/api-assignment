import { Request, Response, NextFunction } from 'express'
import { ExerciseService } from '../services/ExerciseService'


/**
 * Encapsulates a controller.
 */
export class ExerciseController {

  #service: ExerciseService

  constructor(service: ExerciseService) {
    this.#service = service
  }

  async add(req: Request, res: Response, next: NextFunction): Promise<void> {
 
  }

  async get(req: Request, res: Response, next: NextFunction): Promise<void> {
   
  }


  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
   
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
   
  }
}