/**
 * The user account controller.
 *
 * @author Erik Kroon Celander <ek223ur@student.lnu.se>
 * @version 1.0.0
 */

import { Request, Response, NextFunction } from 'express'
import { WorkoutService } from '../services/WorkoutService'


/**
 * Encapsulates a controller.
 */
export class WorkoutController {

  #service: WorkoutService

  constructor(service: WorkoutService) {
    this.#service = service
  }
 

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
 
  }

  async get(req: Request, res: Response, next: NextFunction): Promise<void> {
   
  }


  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
   
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
   
  }
}
