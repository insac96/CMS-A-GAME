import type { Mongoose } from 'mongoose'
import type { IDBSocketChat } from '~~/types'

export const DBSocketChat = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBSocketChat>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    text: { type: String }
  }, {
    timestamps: true
  })

  const model = mongoose.model('socket_chats', schema)
  return model 
}