import { Request, Response, NextFunction } from 'express'
import { Webhook, IWebhook } from '../models/webhook'
import { WebhooksService } from '../services/WebhooksService'
import createError from 'http-errors'
import { AuthenticatedRequest } from './UsersController'
import { WorkoutRequest } from './WorkoutsController'

export class WebhooksController {
  #service: WebhooksService

  constructor(service: WebhooksService) {
    this.#service = service
  }

  /**
   * Creates a new webhook.
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { url } = req.body as { url: string }
      const { id } = (req as AuthenticatedRequest).user as { id: string }


      if (!url) {
        throw createError(400, 'URL is required for webhook creation.')
      }

      const webhook = await this.#service.insert({
        url,
        owner: id
      } as IWebhook)


      res.status(201).json({ message: 'Webhook created successfully', webhook })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Fires a webhook.
   */
  async fire(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = (req as AuthenticatedRequest).user as { id: string }

      const webhook = await this.#service.get({ owner: id })

      for (const hook of webhook) {
        try {
          await fetch(hook.url, {
            method: 'POST',
            body: JSON.stringify((req as WorkoutRequest).workout),
          })
        } catch (error) {
          console.error('Error occurred during webhook request:', error)
        }
      }

      

    } catch (error) {
      next(error)
    }
  }

  /**
   * Deletes a webhook.
   */
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      await this.#service.delete(id)
      res.status(204).send('Webhook deleted successfully')
    } catch (error) {
      next(error)
    }
  }
}