import { Types } from 'mongoose'
// accsdad

export interface IAuth {
  _id: Types.ObjectId
  username: string
  type: number
  action: {
    giftcode: boolean
    event: boolean
  }
}

export interface IResp {
  code? : number
  message?: string
  result?: any
}

export interface IFormatDate {
  day: number
  month: number
  year: number
  hour: number
  minute: number
  timestamp: number
  source: any
  dayjs: any
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