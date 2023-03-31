import mongoose, { Document, Model } from 'mongoose'

interface IExercise extends Document {
  name: string
  description: string,
  owner: string
}

interface IExerciseModel extends Model<IExercise> { }

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'You need to enter an exercise name']
  },
  description: {
    type: String,
    required: false
  },
  owner: {
    type: String,
    ref: 'User',
    required: true
  }
})

schema.index({ name: 1, owner: 1 }, { unique: true })

schema.virtual('id').get(function () {
  return this._id.toHexString()
})

const convertOptions = {
  virtuals: true,
  versionKey: false,
  /**
   * Performs a transformation of the resulting object to remove sensitive information.
   *
   * @param {object} _doc - The mongoose document which is being converted.
   * @param {object} ret - The plain object representation which has been converted.
   */
  transform: (_doc: any, ret: any) => {
    delete ret._id
    delete ret.updatedAt
    delete ret.createdAt
    delete ret.owner
  }
}

schema.set('timestamps', false)
schema.set('toObject', convertOptions)
schema.set('toJSON', convertOptions)

const Exercise: IExerciseModel = mongoose.model<IExercise>('Exercise', schema)

export { IExercise, IExerciseModel, Exercise }
