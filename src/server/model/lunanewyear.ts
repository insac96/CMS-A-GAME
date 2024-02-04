import type { Mongoose } from 'mongoose'
import type { IDBLunaEgg, IDBLunaLuckyMoney, IDBLunaPayment, IDBLunaPayMission } from '~~/types/model/lunanewyear'

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
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'items', index: true },
      amount: { type: Number, index: true },
    }],
  }, {
    timestamps: true
  })

  const model = mongoose.model('luna_payments', schema)
  return model
}

export const DBLunaPayMission = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBLunaPayMission>({ 
    need: { type: Number, index: true },
    gift: [{
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'items', index: true },
      amount: { type: Number, index: true },
    }],
  }, {
    timestamps: true
  })

  const model = mongoose.model('luna_pay_missions', schema)
  return model
}

export const DBLunaEgg = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBLunaEgg>({ 
    price1: { type: Number, index: true, default: 400000 },
    price2: { type: Number, index: true, default: 300000 },
    price3: { type: Number, index: true, default: 200000 },
    price4: { type: Number, index: true, default: 100000 },
    price5: { type: Number, index: true, default: 50000 },
    row1: [{
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'items', index: true },
      amount: { type: Number, index: true },
      percent: { type: Number, index: true },
    }],
    row2: [{
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'items', index: true },
      amount: { type: Number, index: true },
      percent: { type: Number, index: true },
    }],
    row3: [{
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'items', index: true },
      amount: { type: Number, index: true },
      percent: { type: Number, index: true },
    }],
    row4: [{
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'items', index: true },
      amount: { type: Number, index: true },
      percent: { type: Number, index: true },
    }],
    row5: [{
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'items', index: true },
      amount: { type: Number, index: true },
      percent: { type: Number, index: true },
    }],
  }, {
    timestamps: true
  })

  const model = mongoose.model('luna_eggs', schema)

  const autoCreate = async () => {
    const event = await model.findOne({})
    if(!event){
      await model.create({})
    }
    else {
      if(!event.price1) event.price1 = 50000
      if(!event.price2) event.price2 = 50000
      if(!event.price3) event.price3 = 50000
      if(!event.price4) event.price4 = 50000
      if(!event.price5) event.price5 = 50000
      await event.save()
    }
  }

  autoCreate()

  return model
}
