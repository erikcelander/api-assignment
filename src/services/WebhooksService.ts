import { MongooseServiceBase } from './MongooseServiceBase'
import { WebhookRepository } from '../repositories/WebhookRepository'
import { IWebhook } from '../models/webhook'

// This is a service class that extends the MongooseServiceBase class.
export class WebhooksService extends MongooseServiceBase<IWebhook> {
  constructor(repository = new WebhookRepository()) {
    super(repository)
  }
}
