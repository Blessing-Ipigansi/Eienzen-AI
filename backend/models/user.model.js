import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "username is required"],
    unique: true,
    trim: true,
    minLength: 2,
    maxLength: 50,
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    trim: true,
    minLength: 5,
    maxLength: 255,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, "Please fill a valid email address"],
  },
  password: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    unique: true,
  }
}, { timestamps: true, strict: "throw", collection: 'users' })

const User = mongoose.model('User', userSchema)

export default User;