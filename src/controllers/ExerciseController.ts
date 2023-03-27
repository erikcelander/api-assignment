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
 

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
 
  }


  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
   
  }
}