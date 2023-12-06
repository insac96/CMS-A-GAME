import { Types } from 'mongoose'

export interface IResp {
  code? : number
  message?: string
  result?: any
}

export interface IFormatDate {
  day: number
  month: number
  year: number
  timestamp: number
  source: any
}

export interface ISendNotifyUser {
  from?: Types.ObjectId
  to?: Array<Types.ObjectId>
  title?: string
  content: string
  link?: string
  type?: number
  color?: string
}