import type { Types } from 'mongoose'

export interface IDBGameServerLogin {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  user: Types.ObjectId
  server: string
}