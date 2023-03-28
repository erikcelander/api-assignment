/**
 * The user account controller.
 *
 * @author Erik Kroon Celander <ek223ur@student.lnu.se>
 * @version 1.0.0
 */

import { Request, Response, NextFunction } from 'express'
import { WorkoutsService } from '../services/WorkoutsService'
import mongoose, { Document } from 'mongoose'
import { IWorkout } from '../models/workout'
import createError from 'http-errors'
import { AuthenticatedRequest } from '../middleware/authJWT'
import { IExercise } from '../models/exercise'

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
    try {
      const { name } = req.body
      const { user: { id } } = req as AuthenticatedRequest
  
      if (!name) {
        throw new Error('Workout name is required.')
      }

      const exercises: Array<{
        exercise: IExercise['_id']
        reps: number
        sets: number
        weight: number
      }> = []
  
      const workoutData = {
        name: name.trim(),
        exercises: exercises,
        owner: id
      }
  
      const workout = await this.#service.insert(workoutData as IWorkout);
  
      res.status(201).json(workout as IWorkout)
    } catch (err) {
      next(err)
    }
  }
  
  
  async get(req: WorkoutRequest, res: Response, next: NextFunction): Promise<void> {
    res.json(req.workout as IWorkout);
  }
  
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const workouts = await this.#service.get();
      res.json(workouts as IWorkout[]);
    } catch (error) {
      next(error);
    }
  }
  
  async partiallyUpdate(req: WorkoutRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name } = req.body;
  
      if (!req.workout) {
        throw createError(404, 'Workout not found');
      }
  
      if (!name) {
        throw createError(400, 'At least one property (name) is required for partial updates.');
      }
  
      const partialWorkout: Partial<IWorkout> = {};
      if (name) partialWorkout.name = name.trim();
  
      const updatedWorkout = await this.#service.update(req.workout.id, partialWorkout);
  
      res.json({ workout: updatedWorkout });
    } catch (err) {
      next(err);
    }
  }
  
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name } = req.body;
  
      const updatedWorkout = await this.#service.update(req.params.id, {
        name: name.trim(),
      } as IWorkout);
  
      res.json({ workout: updatedWorkout });
    } catch (error: any) {
      const err = createError(error.name === 'ValidationError'
        ? 400 // bad format
        : 500 // something went really wrong
      );
      err.cause = error;
  
      next(err);
    }
  }
  
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.#service.delete(req.params.id);
      res
        .status(204)
        .end();
    } catch (error) {
      next(error);
    }
  }
  
}
