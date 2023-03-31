import { MongooseRepositoryBase } from './MongooseRepositoryBase'
import { Webhook, IWebhook } from '../models/webhook'

export class WebhookRepository extends MongooseRepositoryBase<IWebhook> {
  constructor(model = Webhook) {
    super(model)
  }
}
