import type { IDBUser, IDBItem, IAuth, IDBLunaLuckyMoney } from "~~/types"

const currencyTypeList = [
  'coin', 'wheel', 'notify'
]

const getRandomGift = (list : Array<IDBLunaLuckyMoney>) : IDBLunaLuckyMoney => {
  // Get Random
  let totalPercent = 0
  let rand = 0

  totalPercent = list.reduce((accumulator, object) => {
    return parseFloat(String(accumulator)) + parseFloat(String(object.percent))
  }, 0)
  totalPercent = totalPercent
  rand = Math.random() * totalPercent

  // Get Chances
  const chances : Array<number> = []
  let acc = 0
  list.forEach(i => {
    acc = parseFloat(String(acc)) + (parseFloat(String(i.percent)))
    chances.push(acc)
  })

  // Get Index
  let index : number = 0
  chances.forEach(i => {
    if(i <= rand){
      index = index + 1
    }
  })

  return list[index]
}

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { server, role } = body
    if(!server || !role) throw 'Dữ liệu đầu vào sai'

    // Get User
    const user = await DB.User.findOne({ _id: auth._id }).select('lunanewyear level') as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'
    if(user.lunanewyear.luckymoney < 1) throw 'Bạn đã hết lượt mở lì xì'

    // List Gift
    const list = await DB.LunaLuckyMoney
    .find()
    .select('item amount percent updatedAt')
    .sort({ updatedAt: -1 }) as Array<IDBLunaLuckyMoney>
    if(list.length == 0) throw 'Phong bao lì xì chưa có phần thưởng để nhận, vui lòng quay lại sau'

    // Get Random Gift
    const resultGift = getRandomGift(list)
    if(!resultGift) throw 'Có lỗi xảy ra, vui lòng thử lại sau'

    // Send Item
    const item = await DB.Item.findOne({ _id: resultGift.item }) as IDBItem

    if(item.type == 'game_item'){
      await gameSendMail(event, {
        account: auth.username,
        server_id: server,
        role_id: role,
        title: 'Quà Lì Xì May Mắn',
        content: 'Vật phẩm nhận từ lì xì may mắn',
        items: [{ 
          id: item.item_id, 
          amount: resultGift.amount 
        }]
      })
    }

    if(!!currencyTypeList.includes(item.type)){
      await DB.User.updateOne({ _id: auth._id }, {
        $inc: {
          [`currency.${item.type}`]: resultGift.amount 
        }
      })
    }

    // Log User
    if(item.type == 'coin'){
      logUser(event, auth._id, `Nhận <b>${resultGift.amount.toLocaleString('vi-VN')}</b> xu từ <b>lì xì may mắn</b>`)
    }
    else if(item.type == 'wheel'){
      logUser(event, auth._id, `Nhận <b>${resultGift.amount.toLocaleString('vi-VN')}</b> lượt quay từ <b>lì xì may mắn</b>`)
    }
    else if(item.type == 'notify'){
      logUser(event, auth._id, `Nhận <b>${resultGift.amount.toLocaleString('vi-VN')}</b> lượt gửi thông báo từ <b>lì xì may mắn</b>`)
    }
    else {
      logUser(event, auth._id, `Nhận quà từ <b>lì xì may mắn</b>`)
    }

    // Update User
    await DB.User.updateOne({ _id: auth._id }, { 
      $inc: { 'lunanewyear.luckymoney':  -1 }
    })

    // Result
    const result = JSON.parse(JSON.stringify(item))
    result.amount = resultGift.amount

    return resp(event, { result: result })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})