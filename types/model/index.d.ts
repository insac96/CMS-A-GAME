import type { Model } from 'mongoose'
export { IDBConfig, IDBConfigStore } from './config'
export { IDBNews, IDBNewsCategory } from './news'
export { IDBUser, IDBUserLogin, IDBUserStore } from './user'
export { IDBLevel } from './level'
export { IDBGate } from './gate'
export { IDBPayment } from './payment'
export { IDBWithdraw } from './withdraw'
export { IDBNotifyUser, IDBNotifyAdmin } from './notify'
export { IDBItem } from './item'
export { IDBShop, IDBShopHistory } from './shop'
export { IDBEvent, IDBEventHistory } from './event'
export { IDBGiftcode, IDBGiftcodeHistory } from './giftcode'
export { IDBDice, IDBDiceHistory, IDBDiceLuckyUser } from './dice'
export { IDBWheel, IDBWheelHistory, IDBWheelLuckyUser } from './wheel'
export { IDBGameRankGift, IDBGameRankGiftHistory } from './game'
export { IDBLogAdmin, IDBLogAdminSendItem, IDBLogUser, IDBLogUserIP, IDBLogBlockIP } from './log'
export { IDBAdsLanding } from './ads'

export { IDBSocketOnline, IDBSocketChat } from './socket'

export interface IGlobalDB {
  Config: Model<IDBConfig>

  News: Model<IDBNews>
  NewsCategory: Model<IDBNewsCategory>

  User: Model<IDBUser>
  UserLogin: Model<IDBUserLogin>
  Level: Model<IDBLevel>

  Gate: Model<IDBGate>
  Payment: Model<IDBPayment>

  Withdraw: Model<IDBWithdraw>

  NotifyUser: Model<IDBNotifyUser>
  NotifyAdmin: Model<IDBNotifyAdmin>

  Item: Model<IDBItem>

  Shop: Model<IDBShop>
  ShopHistory: Model<IDBShopHistory>

  Event: Model<IDBEvent>
  EventHistory: Model<IDBEventHistory>

  Giftcode: Model<IDBGiftcode>
  GiftcodeHistory: Model<IDBGiftcodeHistory>

  Dice: Model<IDBDice>
  DiceHistory: Model<IDBDiceHistory>
  DiceLuckyUser: Model<IDBDiceLuckyUser>

  Wheel: Model<IDBWheel>
  WheelHistory: Model<IDBWheelHistory>
  WheelLuckyUser: Model<IDBWheelLuckyUser>

  GameRankGift: Model<IDBGameRankGift>
  GameRankGiftHistory: Model<IDBGameRankGiftHistory>

  LogAdmin: Model<IDBLogAdmin>
  LogAdminSendItem: Model<IDBLogAdminSendItem>

  LogBlockIP: Model<IDBLogBlockIP>
  LogUser: Model<IDBLogUser>
  LogUserIP: Model<IDBLogUserIP>

  SocketOnline: Model<IDBSocketOnline>
  SocketChat: Model<IDBSocketChat>

  AdsLanding: Model<IDBAdsLanding>
}