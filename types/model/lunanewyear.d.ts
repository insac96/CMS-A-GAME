import type { Types } from 'mongoose'

export interface IDBLunaLuckyMoney {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  
  item: Types.ObjectId
  amount: number
  percent: number
}

export interface IDBLunaPayment {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  gift: Array<{
    item: Types.ObjectId | IDBItem,
    amount: number
  }>
  need: number
}

export interface IDBLunaPayMission {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  gift: Array<{
    item: Types.ObjectId | IDBItem,
    amount: number
  }>
  need: number
}