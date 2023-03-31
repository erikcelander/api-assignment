import { Request, Response, NextFunction } from 'express'
import { Webhook, IWebhook } from '../models/webhook'
import { WebhooksService } from '../services/WebhooksService'
import createError from 'http-errors'
import { AuthenticatedRequest } from './UsersController'

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
      const { id, payload } = req.body

      if (!id) {
        res.status(400).json({ message: 'Webhook id is required.' })
        return
      }

      const webhook = await this.#service.getById(id)

      if (!webhook) {
        res.status(404).json({ message: 'Webhook not found.' })
        return
      }

      await fetch(webhook.url, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      })

      res.status(200).json({ message: 'Webhook fired successfully.' })
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