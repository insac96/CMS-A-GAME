import type { Types } from 'mongoose'

export interface IDBDice {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  jar: {
    default: number
    now: number
  },
  percent: {
    six: number
    other: number
  }
}

export interface IDBDiceHistory {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  user: Types.ObjectId
  dices: Array<number>
  coin: {
    play: number
    receive: number
    jar: number
  }
}