import type { IAuth, IDBEvent, IDBEventConfig, IDBItem } from '~~/types'

const currencyTypeList = [
  'coin', 'wheel'
]

const typeName : any = {
  'login.month' : 'Đăng nhập tháng', 
  'login.total': 'Đăng nhập tổng', 
  'pay.total.money': 'Tích nạp tổng', 
  'pay.day.money': 'Tích nạp ngày', 
  'pay.month.money': 'Tích nạp tháng', 
  'spend.total.coin': 'Tiêu phí tổng',
  'spend.day.coin': 'Tiêu phí ngày',
  'spend.month.coin': 'Tiêu phí tháng',
  'referral.count': 'Giới thiệu bạn',
  'paymusty': 'Nạp đơn',
  'paydays': 'Liên nạp'
}

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { server, role, event : eventID } = await readBody(event)
    if(!eventID) throw 'Không tìm thấy ID sự kiện'
    if(!server) throw 'Không tìm thấy ID máy chủ'
    if(!role) throw 'Không tìm thấy ID nhân vật'

    // Event
    const eventData = await DB.Event
    .findOne({ _id: eventID })
    .populate({
      path: 'gift.item',
      select: 'item_id type need'
    }) as IDBEvent

    // Check Event
    if(!eventData) throw 'Mốc thưởng không tồn tại'
    if(eventData.gift.length == 0) throw 'Mốc chưa có phần thưởng để nhận'

    // Event Config
    const eventConfig = await DB.EventConfig.findOne({ type: eventData.type }) as IDBEventConfig
    if(!eventConfig) throw 'Kiểu sự kiện không hỗ trợ'

    // Check Active
    const active = await getEventActive(event, eventData, eventData.type)
    if(active != 0) throw 'Bạn chưa đủ điều kiện để nhận'

    // Format Gift
    const giftItem : Array<any> = []
    const giftCurrency : any = {}

    eventData.gift.forEach(gift => {
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
        title: 'Web Event',
        content: `Vật phẩm nhận từ sự kiện ${typeName[eventData.type]} trên Web`,
        items: giftItem
      })
    }
      
    if(Object.keys(giftCurrency).length){
      await DB.User.updateOne({ _id: auth._id },{
        $inc: giftCurrency
      })
    }

    // Pay Days
    if(eventData.type == 'paydays'){
      await DB.User.updateOne({ _id: auth._id }, {
        'paydays.receive': eventData.need
      })
    }
    
    // History
    await DB.EventHistory.create({
      user: auth._id,
      event: eventData._id,
      server: server,
      role: role
    })

    // Log User
    const change : any = []
    if(!!giftCurrency[`currency.coin`] && giftCurrency[`currency.coin`] > 0){
      change.push(`${giftCurrency[`currency.coin`].toLocaleString('vi-VN')} xu`) 
    }

    logUser(event, auth._id, `Nhận thưởng mốc <b>${eventData.need.toLocaleString('vi-VN')}</b> của sự kiện <b>${typeName[eventData.type]}</b> tại máy chủ <b>${server}</b> nhân vật <b>${role}</b>`)
    if(change.length > 0) logUser(event, auth._id, `Nhận <b>${change.join(', ')}</b> từ mốc <b>${eventData.need.toLocaleString('vi-VN')}</b> của sự kiện <b>${typeName[eventData.type]}</b>`)
    
    return resp(event, { message: 'Nhận thưởng thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})