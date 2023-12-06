import type { Types } from 'mongoose'

export interface IDBGameSendHistory {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  from: Types.ObjectId
  to: Types.ObjectId
  server: string
  role: string
  reason: string
}