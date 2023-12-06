import type { Types } from 'mongoose'

export interface IDBItem {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  
  item_id: string
  item_name: string
  item_image: string
  type: string
}