import type { IGlobalDB } from '~~/types'
import type { Mongoose } from 'mongoose'
import { DBConfig } from './config'
import { DBNews, DBNewsCategory } from './news'
import { DBUser } from './user'
import { DBLevel } from './level'
import { DBGate } from './gate'
import { DBPayment } from './payment'
import { DBWithdraw } from './withdraw'
import { DBNotifyUser, DBNotifyAdmin } from './notify'
import { DBItem } from './item'
import { DBShop, DBShopHistory } from './shop'
import { DBEvent, DBEventHistory } from './event'
import { DBGiftcode, DBGiftcodeHistory } from './giftcode'
import { DBDice, DBDiceHistory, DBDiceLuckyUser } from './dice'
import { DBWheel, DBWheelHistory, DBWheelLuckyUser } from './wheel'
import { DBLogAdmin, DBLogAdminSendItem, DBLogUser, DBLogUserIP, DBLogBlockIP } from './log'

export default (mongoose : Mongoose) : IGlobalDB => {
  return {
    Config: DBConfig(mongoose),
    
    NewsCategory: DBNewsCategory(mongoose),
    News: DBNews(mongoose),

    User: DBUser(mongoose),
    Level: DBLevel(mongoose),

    Gate: DBGate(mongoose),
    Payment: DBPayment(mongoose),

    Withdraw: DBWithdraw(mongoose),

    NotifyUser: DBNotifyUser(mongoose),
    NotifyAdmin: DBNotifyAdmin(mongoose),

    Item: DBItem(mongoose),
    
    Shop: DBShop(mongoose),
    ShopHistory: DBShopHistory(mongoose),

    Event: DBEvent(mongoose),
    EventHistory: DBEventHistory(mongoose),

    Giftcode: DBGiftcode(mongoose),
    GiftcodeHistory: DBGiftcodeHistory(mongoose),

    Dice: DBDice(mongoose),
    DiceHistory: DBDiceHistory(mongoose),
    DiceLuckyUser: DBDiceLuckyUser(mongoose),

    Wheel: DBWheel(mongoose),
    WheelHistory: DBWheelHistory(mongoose),
    WheelLuckyUser: DBWheelLuckyUser(mongoose),

    LogAdmin: DBLogAdmin(mongoose),
    LogAdminSendItem: DBLogAdminSendItem(mongoose),

    LogBlockIP: DBLogBlockIP(mongoose),
    LogUser: DBLogUser(mongoose),
    LogUserIP: DBLogUserIP(mongoose),
  }
}