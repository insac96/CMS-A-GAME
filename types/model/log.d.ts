import type { Types } from 'mongoose'

export interface IDBLogAdmin {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  
  user: Types.ObjectId
  action: string
}

export interface IDBLogUserIP {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  
  user: Types.ObjectId
  ip: string
}

export interface IDBLogBlockIP {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  
  ip: string
}