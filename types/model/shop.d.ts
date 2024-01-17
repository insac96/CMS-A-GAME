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

export interface IDBShopBox {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  gift: Array<{
    item: Types.ObjectId | IDBItem,
    amount: number
  }>
  amount: number
  price: number
  limit: number
  pin: number
  display: number
}

export interface IDBShopBoxHistory {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  
  user: Types.ObjectId
  box: Types.ObjectId
  amount: number
  price: number
  server: string
  role: string
}