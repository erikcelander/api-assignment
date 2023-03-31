import { Schema, model, Document } from 'mongoose'

export interface IWebhook extends Document {
  url: string
  event: string
}

const webhookSchema = new Schema<IWebhook>({
  url: { type: String, required: true },
  event: { type: String, required: true },
})

export const Webhook = model<IWebhook>('Webhook', webhookSchema)
