import type { Types } from 'mongoose'

export interface IDBGameRankGift {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  server: string
  type: string
  start: number
  end: number
  gift: Array<{
    item: Types.ObjectId | IDBItem,
    amount: number
  }>
}