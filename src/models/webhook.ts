import mongoose, { Document, Model } from 'mongoose'

export interface IWebhook extends Document {
  url: string
  owner: string
}

interface IWebhookModel extends Model<IWebhook> { }

const schema = new mongoose.Schema<IWebhook>(
  {
    url: { type: String, required: true },
    owner: { type: String, ref: 'User', required: true },
  }
)

schema.virtual('id').get(function () {
  return this._id.toHexString()
})

const convertOptions = {
  virtuals: true,
  versionKey: false,
  transform: (doc: any, ret: any) => {
    delete ret._id
    delete ret.updatedAt
    delete ret.createdAt
    delete ret.owner
  },
}


schema.set('timestamps', true)
schema.set('toObject', convertOptions)
schema.set('toJSON', convertOptions)

export const Webhook: IWebhookModel = mongoose.model<IWebhook>('Webhook', schema)
