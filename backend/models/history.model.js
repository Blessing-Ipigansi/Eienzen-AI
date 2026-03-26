import mongoose from 'mongoose'

const historySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  model: {
    type: String,
    required: [true, "AI model not specified"],
  },
  contents: {
    type: Array,
  },
  config: {
    type: Object
  }
})

const History = new mongoose.model('History', historySchema)

export default History;