import type { Mongoose } from 'mongoose'
import type { IDBGameServerLogin } from '~~/types'

export const DBGameServerLogin = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGameServerLogin>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    server: { type: String }
  }, {
    timestamps: true
  })

  const model = mongoose.model('game_server_login', schema)
  return model 
}