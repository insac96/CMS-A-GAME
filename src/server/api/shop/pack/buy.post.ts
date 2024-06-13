import type { IDBLevel, IDBUser, IDBShopPack, IDBItem, IAuth, IDBShopConfig } from "~~/types"

const currencyTypeList = [
  'coin', 'wheel'
]

const moneyType = ['coin', 'diamond']

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { pack, server, role, money : buyBy } = await readBody(event)
    if(!pack) throw 'Không tìm thấy ID vật phẩm'
    if(!server) throw 'Không tìm thấy ID máy chủ'
    if(!role) throw 'Không tìm thấy ID nhân vật'
    if(!moneyType.includes(buyBy)) throw 'Tiền tệ không hỗ trợ'

    // Shop Config
    const shopConfig = await DB.ShopConfig.findOne() as IDBShopConfig
    if(!shopConfig) throw 'Không tìm thấy cấu hình cửa hàng'
    if(!!shopConfig.maintenance) throw 'Cửa hàng đang bảo trì, vui lòng quay lại sau'

    // Check User
    const user = await DB.User.findOne({ _id: auth._id }).select('currency.coin currency.diamond level spend') as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'
    const level = await DB.Level.findOne({ _id: user.level }).select('limit.spend discount') as IDBLevel
    if(!level) throw 'Không tìm thấy thông tin cấp độ'

    // Shop Pack Data
    const shopPack = await DB.ShopPack
    .findOne({ _id: pack }) 
    .select('name gift price limit')
    .populate({
      path: 'gift.item',
      select: 'item_id type'
    }) as IDBShopPack
    if(!shopPack) throw 'Gói không tồn tại'

    // Total Price
    const price = shopPack.price
    const discountLevel = level.discount
    const discountSystem = getShopDiscount(event, shopConfig)
    const discount = discountLevel + discountSystem > 100 ? 100 : discountLevel + discountSystem
    const totalPrice = Math.floor(price - Math.floor(price * discount / 100))

    // @ts-expect-error
    if(totalPrice > user.currency[buyBy]) throw 'Số dư xu không đủ'

    // Check Limit Spend
    const spend = user.spend
    const limit = level.limit.spend
    const limitCoinDay = limit.day.coin == 0 ? -1 : (limit.day.coin - spend.day.coin) < 0 ? 0 : (limit.day.coin - spend.day.coin)
    const limitCountyDay = limit.day.count == 0 ? -1 : (limit.day.count - spend.day.count) < 0 ? 0 : (limit.day.count - spend.day.count)
    const limitCoinMonth = limit.month.coin == 0 ? -1 : (limit.month.coin - spend.month.coin) < 0 ? 0 : (limit.month.coin - spend.month.coin)
    const limitCountMonth = limit.month.count == 0 ? -1 : (limit.month.count - spend.month.count) < 0 ? 0 : (limit.month.count - spend.month.count)
  
    if(limitCountyDay != -1 && limitCountyDay <= 0) throw 'Bạn đã hết lượt tiêu phí hôm nay'
    if(limitCoinDay != -1 && limitCoinDay <= 0) throw 'Bạn đã đạt giới hạn tiêu phí hôm nay'
    if(limitCoinDay != -1 && totalPrice > limitCoinDay) throw `Hôm nay bạn chỉ có thể tiêu tối đa ${limitCoinDay.toLocaleString("vi-VN")} Xu`
    if(limitCountMonth != -1 && limitCountMonth <= 0) throw 'Bạn đã hết lượt tiêu phí tháng này'
    if(limitCoinMonth != -1 && limitCoinMonth <= 0) throw 'Bạn đã đạt giới hạn tiêu phí tháng này'
    if(limitCoinMonth != -1 && totalPrice > limitCoinMonth) throw `Tháng này bạn chỉ có thể tiêu tối đa ${limitCoinMonth.toLocaleString("vi-VN")} Xu`

    // Check Limit Buy
    if(shopPack.limit > 0){
      const now = DayJS(Date.now())
      const start = now.startOf('date')
      const end = now.endOf('date')
      const matchTime = { $gte: new Date(start['$d']), $lte: new Date(end['$d']) }

      const historyDay = await DB.ShopPackHistory.aggregate([
        { $match: {
          user: user._id,
          pack: shopPack._id,
          server: server
        }},
        {
          $project: {
            createdAt: 1,
            timeformat: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'Asia/Ho_Chi_Minh' }
            }
          }
        },
        {
          $group: {
            _id: '$timeformat',
            time: { $max: '$createdAt' },
            count: { $count: {} },
          }
        },
        { $match: { 
          time: matchTime
        }}
      ])

      if(!!historyDay[0] && historyDay[0].count >= shopPack.limit) throw `Hôm nay bạn đã đạt giới hạn mua gói này`
    }

    // Format Gift
    const giftItem : Array<any> = []
    const giftCurrency : any = {}

    shopPack.gift.forEach(gift => {
      const item = gift.item as IDBItem

      if(item.type == 'game_item'){
        giftItem.push({ id: item.item_id, amount: gift.amount })
      }
      if(!!currencyTypeList.includes(item.type)){
        giftCurrency[`currency.${item.type}`] = gift.amount
      }
    })

    // Send Gift
    if(giftItem.length > 0){
      await gameSendMail(event, {
        account: auth.username,
        server_id: server,
        role_id: role,
        title: 'Web Shop',
        content: 'Gói mua từ cửa hàng trên Web',
        items: giftItem
      })
    }
      
    if(Object.keys(giftCurrency).length){
      await DB.User.updateOne({ _id: auth._id },{
        $inc: giftCurrency
      })
    }

    // Update User
    await DB.User.updateOne({ _id: auth._id },{
      $inc: {
        [`currency.${buyBy}`]: totalPrice * -1,
        'spend.total.coin': totalPrice,
        'spend.day.coin': totalPrice,
        'spend.month.coin': totalPrice,
        'spend.total.count': 1,
        'spend.day.count': 1,
        'spend.month.count': 1,
      }
    })

    // History
    await DB.ShopPackHistory.create({
      user: auth._id,
      pack: shopPack._id,
      server: server,
      role: role,
      price: totalPrice,
    })

    logUser(event, auth._id, `Dùng <b>${totalPrice.toLocaleString("vi-VN")} ${buyBy == 'coin' ? 'Xu' : 'Cống Hiến'}</b> để mua gói <b>${shopPack.name}</b> tại máy chủ <b>${server}</b> nhân vật <b>${role}</b>`)

    return resp(event, { message: 'Mua gói thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})