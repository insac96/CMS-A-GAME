import type { Mongoose } from 'mongoose'
import type { IDBGameRankGift, IDBGameRankGiftHistory } from '~~/types'

export const DBGameRankGift = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGameRankGift>({ 
    type: { type: String },
    server: { type: String },
    start: { type: Number, index: true },
    end: { type: Number, index: true },
    expired: { type: Date },
    gift: [{
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'items' },
      amount: { type: Number, index: true },
    }]
  }, {
    timestamps: true
  })

  const model = mongoose.model('game_rank_gifts', schema)
  return model 
}

export const DBGameRankGiftHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGameRankGiftHistory>({ 
    rankgift: { type: mongoose.Schema.Types.ObjectId, ref: 'game_rank_gifts' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    server: { type: String },
    role: { type: String },
    rank: { type: Number }
  }, {
    timestamps: true
  })

  const model = mongoose.model('game_rank_gift_histories', schema)
  return model 
}