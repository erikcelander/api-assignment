import mongoose, { Schema, Document, Types } from 'mongoose'

interface IExercise {
  name: string
  sets: number
  reps: number
  weight: number
}

interface IWorkout extends Document {
  user: Types.ObjectId,
  date: Date
  exercises: IExercise[]
  note?: string
}

const ExerciseSchema = new Schema<IExercise>({
  name: {
    type: String,
    required: true,
  },
  sets: {
    type: Number,
    required: true,
  },
  reps: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
})

const WorkoutSchema = new Schema<IWorkout>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  exercises: {
    type: [ExerciseSchema],
    required: true,
  },
  note: {
    type: String,
    default: '',
  },
})

export const Workout = mongoose.model<IWorkout>('Workout', WorkoutSchema)
