import mongoose, { Document, Model } from 'mongoose'

interface IExercise extends Document {
  name: string
  description: string
}

interface IExerciseModel extends Model<IExercise> { }

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'You need to enter an exercise name'],
    },
    description: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_doc, ret) {
        delete ret._id
        delete ret.__v
      },
      virtuals: true
    }
  }
)

const Exercise: IExerciseModel = mongoose.model<IExercise>('Exercise', schema)

export { IExercise, IExerciseModel, Exercise }
