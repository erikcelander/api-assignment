import mongoose, { Document, Model } from 'mongoose'
import { IExercise } from './exercise'

interface IWorkout extends Document {
  exercises: Array<{
    exercise: IExercise['_id']
    reps: number
    sets: number
    weight: number
  }>
}

interface IWorkoutModel extends Model<IWorkout> { }

const schema = new mongoose.Schema(
  {
    exercises: [
      {
        exercise: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Exercise',
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
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret._id
        delete ret.__v
      },
      virtuals: true
    }
  }
)

const Workout: IWorkoutModel = mongoose.model<IWorkout>('Workout', schema)

export { IWorkout, IWorkoutModel, Workout }
