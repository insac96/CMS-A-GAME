import type { Types } from 'mongoose'
import type { IDBItem } from './item'

export interface IDBShopConfig {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  maintenance: boolean
  discount: {
    number: number
    expired: Date
  }
}

export interface IDBShop {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  item: Types.ObjectId | IDBItem
  item_amount: number
  price: number
  limit: number
  pin: number
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