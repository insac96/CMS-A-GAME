import type { Mongoose } from 'mongoose'
import type { IDBAdminIP } from '~~/types'

export const DBAdminIP = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBAdminIP>({ 
    ip: { type: String }
  })

  const model = mongoose.model('admin_ip', schema, 'admin_ip')
  return model 
}

