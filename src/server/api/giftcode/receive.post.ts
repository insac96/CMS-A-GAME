import type { IDBGiftcode, IDBItem } from '~~/types'

const currencyTypeList = [
  'coin', 'wheel', 'notify'
]

export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth
    if(!auth) throw 'Vui lòng đăng nhập trước'

    const { server, role, giftcode } = await readBody(event)
    if(!giftcode) throw 'Không tìm thấy ID sụ kiện'
    if(!server) throw 'Không tìm thấy ID máy chủ'
    if(!role) throw 'Không tìm thấy ID nhân vật'

    // Giftcode
    const giftcodeData = await DB.Giftcode
    .findOne({ _id: giftcode, display: 1 })
    .populate({
      path: 'gift.item',
      select: 'item_id type'
    })
    .select('-createdAt -updateAt -display') as IDBGiftcode

    // Check Giftcode
    if(!giftcodeData) throw 'Mã không tồn tại'
    if(giftcodeData.gift.length == 0) throw 'Mã chưa có phần thưởng để nhận'
    
    // Check Active
    if(giftcodeData.limit > 0){
      const countReceive = await DB.GiftcodeHistory.count({ giftcode: giftcodeData._id })
      if(countReceive >= giftcodeData.limit) throw 'Mã này đã hết lượt sử dụng'
    }
    const countReceiveAuth = await DB.GiftcodeHistory.count({ user: auth._id, giftcode: giftcodeData._id })
    if(countReceiveAuth > 0) throw 'Bạn đã nhận mã này rồi'

    // Format Gift
    const giftItem : Array<any> = []
    const giftCurrency : any = {}

    giftcodeData.gift.forEach(gift => {
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
        title: 'Web Giftcode',
        content: 'Vật phẩm nhận từ Giftcode trên Web',
        items: giftItem
      })
    }
      
    if(Object.keys(giftCurrency).length){
      await DB.User.updateOne({ _id: auth._id },{
        $inc: giftCurrency
      })
    }

    // History
    await DB.GiftcodeHistory.create({
      user: auth._id,
      giftcode: giftcodeData._id,
      server: server
    })
    
    return resp(event, { message: 'Nhận thưởng thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})