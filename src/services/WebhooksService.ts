import { MongooseServiceBase } from './MongooseServiceBase'
import { WebhookRepository } from '../repositories/WebhookRepository'
import { IWebhook } from '../models/webhook'

export class WebhooksService extends MongooseServiceBase<IWebhook> {
  constructor(repository = new WebhookRepository()) {
    super(repository)
  }
}
