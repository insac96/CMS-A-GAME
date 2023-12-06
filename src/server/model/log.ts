import type { Mongoose } from 'mongoose'
import type { IDBLogAdmin, IDBLogUser, IDBLogUserIP, IDBLogBlockIP } from '~~/types'

export const DBLogAdmin = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBLogAdmin>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    action: { type: String },
  }, {
    timestamps: true
  })

  const model = mongoose.model('admin_logs', schema)
  return model
}

export const DBLogUser = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBLogUser>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    action: { type: String },
  }, {
    timestamps: true
  })

  const model = mongoose.model('user_logs', schema)
  return model
}


export const DBLogUserIP = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBLogUserIP>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    ip: { type: String },
  }, {
    timestamps: true
  })

  const model = mongoose.model('user_ip_logs', schema)
  return model
}

export const DBLogBlockIP = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBLogBlockIP>({ 
    ip: { type: String },
  }, {
    timestamps: true
  })

  const model = mongoose.model('block_ip_logs', schema)
  return model
}