import type { Mongoose } from 'mongoose'
import type { IDBGameRankGift } from '~~/types'

export const DBGameRankGift = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGameRankGift>({ 
    type: { type: String },
    server: { type: String },
    start: { type: Number, index: true },
    end: { type: Number, index: true },
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