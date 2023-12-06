import type { IDBEvent, IDBItem } from '~~/types'

const currencyTypeList = [
  'coin', 'wheel', 'notify'
]

export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth
    if(!auth) throw 'Vui lòng đăng nhập trước'

    const { server, role, event : eventID } = await readBody(event)
    if(!eventID) throw 'Không tìm thấy ID sụ kiện'
    if(!server) throw 'Không tìm thấy ID máy chủ'
    if(!role) throw 'Không tìm thấy ID nhân vật'

    // Event
    const eventData = await DB.Event
    .findOne({ _id: eventID, display: 1 })
    .populate({
      path: 'gift.item',
      select: 'item_id type'
    })
    .select('-createdAt -updateAt -display') as IDBEvent

    // Check Event
    if(!eventData) throw 'Mốc thưởng không tồn tại'
    if(eventData.gift.length == 0) throw 'Mốc chưa có phần thưởng để nhận'

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
        content: 'Vật phẩm nhận từ sự kiện trên Web',
        items: giftItem
      })
    }
      
    if(Object.keys(giftCurrency).length){
      await DB.User.updateOne({ _id: auth._id },{
        $inc: giftCurrency
      })
    }
    
    // History
    await DB.EventHistory.create({
      user: auth._id,
      event: eventData._id,
      server: server
    })
    
    return resp(event, { message: 'Nhận thưởng thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})