import type { Types } from 'mongoose'
import type { IDBItem } from './item'

export interface IDBShop {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  item: Types.ObjectId | IDBItem
  price: number
  limit: number
  display: number
}

export interface IDBShopHistory {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  user: Types.ObjectId
  item: Types.ObjectId
  price: number
  amount: number
  server: string
  role: string
}