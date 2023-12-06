import type { IDBUser, IDBLevel, IDBWheel, IDBItem } from "~~/types"

const currencyTypeList = [
  'coin', 'wheel', 'notify'
]

const getRandomGift = (list : Array<IDBWheel>) : IDBWheel => {
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
    const auth = event.context.auth
    if(!auth) throw 'Vui lòng đăng nhập trước'

    const body = await readBody(event)
    const { server, role } = body
    if(!server || !role) throw 'Dữ liệu đầu vào sai'

    // Get User
    const user = await DB.User.findOne({ _id: auth._id }).select('currency.wheel level wheel') as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'
    if(user.currency.wheel < 1) throw 'Bạn đã hết lượt quay'
    const level = await DB.Level.findOne({ _id: user.level }).select('limit.wheel') as IDBLevel
    if(!level) throw 'Không tìm thấy thông tin cấp độ'

    // Check Limit
    const wheelUser = user.wheel
    const limit = level.limit.wheel
    const limitDay = limit.day == 0 ? -1 : (limit.day - wheelUser.day) < 0 ? 0 : (limit.day - wheelUser.day)
    const limitMonth = limit.month == 0 ? -1 : (limit.month - wheelUser.month) < 0 ? 0 : (limit.month - wheelUser.month)
    if(limitDay != -1 && limitDay <= 0) throw 'Bạn đã hết lượt chơi hôm nay'
    if(limitMonth != -1 && limitMonth <= 0) throw 'Bạn đã hết lượt chơi tháng này'

    // List Gift
    const list = await DB.Wheel
    .find({ display: 1})
    .select('item amount percent updatedAt')
    .sort({ updatedAt: -1 })
    .limit(10) as Array<IDBWheel>
    if(list.length == 0) throw 'Vòng quay hiện chưa có phần thưởng để bắt đầu'

    // Get Random List
    const resultGift = getRandomGift(list)
    if(!resultGift) throw 'Có lỗi xảy ra, vui lòng thử lại sau'

    // Send Item
    const item = await DB.Item.findOne({ _id: resultGift.item }).select('item_id type') as IDBItem

    if(item.type == 'game_item'){
      await gameSendMail(event, {
        account: auth.username,
        server_id: server,
        role_id: role,
        title: 'Web Wheel Lucky',
        content: 'Vật phẩm nhận từ vòng quay may mắn trên Web',
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

    // Update User
    await DB.User.updateOne({ _id: auth._id }, { 
      $inc: { 
        'currency.wheel': -1,
        'wheel.total': 1,
        'wheel.day': 1,
        'wheel.month': 1,
      }
    })

    // History
    await DB.WheelHistory.create({
      user: auth._id,
      server: server,
      item: item._id,
      amount: resultGift.amount,
      percent: resultGift.percent
    })
    
    return resp(event, { result: resultGift._id })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})