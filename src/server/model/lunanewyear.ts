import type { Mongoose } from 'mongoose'
import type { IDBLunaLuckyMoney, IDBLunaPayment, IDBLunaPayMission } from '~~/types/model/lunanewyear'

export const DBLunaLuckyMoney = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBLunaLuckyMoney>({
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'items', index: true },
    amount: { type: Number, index: true },
    percent: { type: Number, index: true },
  }, {
    timestamps: true
  })

  const model = mongoose.model('luna_lucky_moneys', schema)
  return model
}

export const DBLunaPayment = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBLunaPayment>({ 
    need: { type: Number, index: true },
    gift: [{
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'items' },
      amount: { type: Number, index: true },
    }],
  }, {
    timestamps: true
  })

  const model = mongoose.model('luna_payment', schema)
  return model
}

export const DBLunaPayMission = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBLunaPayMission>({ 
    need: { type: Number, index: true },
    gift: [{
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'items' },
      amount: { type: Number, index: true },
    }],
  }, {
    timestamps: true
  })

  const model = mongoose.model('luna_pay_mission', schema)
  return model
}

