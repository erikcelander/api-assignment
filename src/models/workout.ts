import mongoose, { Document, Model } from 'mongoose'
import { IExercise } from './exercise'

interface IWorkout extends Document {
  name: string,
  exercises: Array<{
    name: string
    id: string
    reps: number
    sets: number
    weight: number
  }>,
  owner: string
}

interface IWorkoutModel extends Model<IWorkout> { }

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'You need to enter a workout name'],
    },
    exercises: [
      {
        _id : false,
        name: {
          type: String,
          required: false,
        },
        id: {
          type: String,
          required: true,
        },
        reps: {
          type: Number,
          required: [true, 'You need to enter the amount of reps'],
        },
        sets: {
          type: Number,
          required: [true, 'You need to enter the amount of sets'],
        },
        weight: {
          type: Number,
          required: [true, 'You need to enter the weight'],
        },
      },
    ],
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
   * @param {object} doc - The mongoose document which is being converted.
   * @param {object} ret - The plain object representation which has been converted.
   */
  transform: (doc: any, ret: any) => {
    delete ret._id
    delete ret.updatedAt
    delete ret.createdAt
    delete ret.owner
  }
}

schema.set('timestamps', true)
schema.set('toObject', convertOptions)
schema.set('toJSON', convertOptions)


const Workout: IWorkoutModel = mongoose.model<IWorkout>('Workout', schema)

export { IWorkout, IWorkoutModel, Workout }
