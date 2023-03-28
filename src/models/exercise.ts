import mongoose, { Document, Model } from 'mongoose'

interface IExercise extends Document {
  name: string
  description: string
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

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
  transform: (_doc: any, ret: { _id: any }) => {
    delete ret._id
  }
}

schema.set('timestamps', true)
schema.set('toObject', convertOptions)
schema.set('toJSON', convertOptions)

const Exercise: IExerciseModel = mongoose.model<IExercise>('Exercise', schema)

export { IExercise, IExerciseModel, Exercise }
