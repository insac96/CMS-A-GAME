import type { Types } from 'mongoose'

export interface IDBSocketChat {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  user: Types.ObjectId
  text: string
  type: string
}