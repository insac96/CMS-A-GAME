import type { Mongoose } from 'mongoose'
import type { IDBGameSendHistory } from '~~/types'

export const DBGameSendHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGameSendHistory>({ 
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    server: { type: String },
    role: { type: String },
    reason: { type: String }
  }, {
    timestamps: true
  })

  const model = mongoose.model('game_send_histories', schema)
  return model 
}

