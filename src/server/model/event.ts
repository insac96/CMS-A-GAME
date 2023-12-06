import type { Mongoose } from 'mongoose'
import type { IDBEvent, IDBEventHistory } from '~~/types'

export const DBEvent = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBEvent>({ 
    type: { type: String },
    need: { type: Number, index: true },
    gift: [{
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'items' },
      amount: { type: Number, index: true },
    }],
    display: { type: Number, default: 1, index: true },
  }, {
    timestamps: true
  })

  const model = mongoose.model('events', schema)
  return model 
}

export const DBEventHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBEventHistory>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'events' },
    server: { type: String },
    role: { type: String },
  }, {
    timestamps: true
  })

  const model = mongoose.model('event_histories', schema)
  return model 
}

