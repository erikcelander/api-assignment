/**
 * The user model.
 *
 * @author Erik Kroon Celander <ek223ur@student.lnu.se>
 * @version 1.0.0
 */

import mongoose, { Document, Model } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'

interface IUser extends Document {
  email: string
  password: string
}

interface IUserModel extends Model<IUser> {
  authenticate(email: string, password: string): Promise<IUser | null>
}

const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, 'You need to enter a valid email'],
      validate: [validator.isEmail, 'The email you have entered is not valid'],
    },
    password: {
      type: String,
      required: [true, 'You need to enter a valid password'],
      minlength: [6, 'Password needs contain at least 6 characters'],
      maxlength: [256, 'Password can only contain 256 characters'],
      writeOnly: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_doc, ret) {
        delete ret._id
        delete ret.__v
      },
      virtuals: true // ensure virtual fields are serialized
    }
  }
)

schema.virtual('id').get(function () {
  return this._id.toHexString()
})

schema.pre<IUser>('save', async function () {
  this.password = await bcrypt.hash(this.password, 6)
})

schema.static('authenticate', async function (email: string, password: string): Promise<IUser | null> {
  if (!email || !password) {
    throw new Error('Email and password are required')
  }

  const user = await this.findOne({ email })
  if (user && (await bcrypt.compare(password, user.password))) {
    return user
  }

  return null
})

const User: IUserModel = mongoose.model<IUser, IUserModel>('User', schema)

export { User, IUser, IUserModel }

