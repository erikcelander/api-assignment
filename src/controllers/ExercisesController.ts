import mongoose, { Request, Response, NextFunction } from 'express'
import { ExercisesService } from '../services/ExercisesService'
import { IExercise, Exercise } from '../models/exercise'
import { AuthenticatedRequest } from './UsersController'
import createError from 'http-errors'
import { Document } from 'mongoose'
import { generateResourceLinks } from '../config/hateoas'


interface ExerciseRequest extends Request {
  exercise?: Document
}


/**
 * Encapsulates a controller.
 */
export class ExercisesController {

  #service: ExercisesService

  constructor(service: ExercisesService) {
    this.#service = service
  }

  /**
   * Provide req.exercise to the route if :id is present.
   */
  async loadExercise(req: ExerciseRequest, res: Response, next: NextFunction, id: string) {
    try {
      const exercise = await this.#service.getById(id)

      if (!exercise || exercise.owner !== (req as AuthenticatedRequest).user.id) {
        throw createError(404, 'The requested resource was either not found or you have no permission to access it.')
      }

      req.exercise = exercise
      next()
    } catch (error: any) {
      next(error)
    }
  }

  /**
   * Creates a new exercise.
   */
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

      const links = generateResourceLinks('exercise', exercise.id, 'single')
      res.status(201).json({ ...exercise.toObject(), links: links })
    } catch (error: any) {
      if (error.name === 'MongoError' && error.code === 11000) {
        error.status = 409
        error.message = 'Exercise with the same name already exists.'
      } else if (error.status !== 400) {
        error.status = error.name === 'ValidationError' ? 400 : 500
        error.message = error.name === 'ValidationError' ? 'Bad request' : 'Something went wrong'
      }

      next(error)
    }
  }


  /**
   * Gets the specified exercise.
   */
  async get(req: ExerciseRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const links = generateResourceLinks('exercise', req.params.id, 'single')
      res.status(200).json({ ...req.exercise?.toObject(), links: links })
    } catch (error: any) {
      error.status = error.name === 'ValidationError' ? 400 : 500
      error.message = error.name === 'ValidationError' ? 'Bad request' : 'Something went wrong'
      next(error)
    }
  }


  /**
   * Get all exercises for the current user.
   */
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const allExercises = await this.#service.get({ owner: (req as AuthenticatedRequest).user.id })
      const exercises = allExercises.map(({ name, id }) => ({ name, id }))

      const exerciseLinks = generateResourceLinks('exercise', '', 'create')
      const workoutLinks = generateResourceLinks('workout', '', 'create')


      if (exercises.length === 0) {
        res.status(204).json({
          message: 'No exercises found',
          links: [...exerciseLinks, ...workoutLinks]
        })
      } else {
        res.status(200).json({ exercises, links: [...exerciseLinks, ...workoutLinks] })
      }
    } catch (error: any) {
      error.status = error.name === 'ValidationError' ? 400 : 500
      error.message = error.name === 'ValidationError' ? 'Bad request' : 'Something went wrong'
      next(error)
    }
  }


  /**
   * Updates the specified exercise with the provided properties.
   */
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

      const links = generateResourceLinks('exercise', req.params.id, 'single')
      res.status(200).json({ exercise: updatedExercise, links: links })
    } catch (error: any) {
      error.status = error.name === 'ValidationError' ? 400 : 500
      error.message = error.name === 'ValidationError' ? 'Bad request' : 'Something went wrong'
      next(error)
    }
  }

  /**
   * Updates the specified exercise.
   */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, description } = req.body

      if (!name) {
        throw createError(400, 'Exercise name is required for updating.')
      }

      const updatedExercise = await this.#service.update(req.params.id, {
        name: name.trim(),
        description: description?.trim(),
      } as IExercise)

      const links = generateResourceLinks('exercise', req.params.id, 'single')
      res.status(200).json({ exercise: updatedExercise, links: links })
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
      res.status(204).json({ message: 'Exercise successfully deleted' })
    } catch (error: any) {
      error.status = 500
      error.message = 'Something went wrong'
      next(error)
    }
  }
}