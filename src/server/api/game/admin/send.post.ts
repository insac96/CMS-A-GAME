import { IAuth, IDBUser, IDBItem } from "~~/types"

const currencyTypeList = [
  'coin', 'wheel'
]

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'game.sendItem')

    const body = await readBody(event)
    const { user, server, role, title, content, reason, items } = body
    if(!user || !server || !role || !reason || !Array.isArray(items)) throw 'Dữ liệu đầu vào không hợp lệ'
    if(items.length < 1) throw 'Dữ liệu vật phẩm không hợp lệ'

    const userData = await DB.User.findOne({ _id: user }).select('_id username') as IDBUser
    if(!userData) throw 'Tài khoản không tồn tại'

    const itemLog = items.map(i => ({
      item: i._id,
      amount: i.amount
    }))

    // Format Gift
    const giftItem : Array<any> = []
    const giftCurrency : any = {}

    items.forEach(gift => {
      const item = gift

      if(item.type == 'game_item'){
        giftItem.push({ id: item.item_id, amount: item.amount })
      }
      if(!!currencyTypeList.includes(item.type)){
        giftCurrency[`currency.${item.type}`] = item.amount
      }
    })

     // Send Gift
     if(giftItem.length > 0){
      await gameSendMail(event, {
        account: userData.username,
        server_id: server,
        role_id: role,
        title: title || 'GM Send',
        content: content || 'Vật phẩm gửi từ GM',
        items: giftItem
      })
    }
      
    if(Object.keys(giftCurrency).length){
      await DB.User.updateOne({ _id: auth._id },{
        $inc: giftCurrency
      })
    }

    await DB.LogAdminSendItem.create({
      from: auth._id,
      to: userData._id,
      server: server,
      role: role,
      reason: reason,
      gift: itemLog
    })

    logUser(event, userData._id, `Nhận <b>vật phẩm</b> từ quản trị viên <b>${auth.username}</b> với lý do <b>${reason}</b>`)
    logAdmin(event, `Gửi vật phẩm cho <b>${userData.username}</b> tại máy chủ <b>${server}</b> với lý do <b>${reason}</b>`)

    return resp(event, { message: 'Gửi thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})