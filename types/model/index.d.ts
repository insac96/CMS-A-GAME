import type { Model } from 'mongoose'

export { IDBConfig, IDBConfigStore } from './config'
export { IDBNews, IDBNewsCategory } from './news'
export { IDBUser, IDBUserStore } from './user'
export { IDBLevel } from './level'
export { IDBGate } from './gate'
export { IDBPayment } from './payment'
export { IDBNotifyUser, IDBNotifyAdmin } from './notify'
export { IDBItem } from './item'
export { IDBShop, IDBShopHistory } from './shop'
export { IDBEvent, IDBEventHistory } from './event'
export { IDBGiftcode, IDBGiftcodeHistory } from './giftcode'
export { IDBDice, IDBDiceHistory } from './dice'
export { IDBWheel, IDBWheelHistory } from './wheel'
export { IDBGameSendHistory } from './game'
export { IDBLogAdmin, IDBLogUserIP, IDBLogBlockIP } from './log'

export interface IGlobalDB {
  Config: Model<IDBConfig>

  News: Model<IDBNews>
  NewsCategory: Model<IDBNewsCategory>

  User: Model<IDBUser>
  Level: Model<IDBLevel>

  Gate: Model<IDBGate>
  Payment: Model<IDBPayment>

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

  Wheel: Model<IDBWheel>
  WheelHistory: Model<IDBWheelHistory>

  GameSendHistory: Model<IDBGameSendHistory>

  LogAdmin: Model<IDBLogAdmin>
  LogBlockIP: Model<IDBLogBlockIP>
  LogUserIP: Model<IDBLogUserIP>
}