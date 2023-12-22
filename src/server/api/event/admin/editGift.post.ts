import type { IAuth } from "~~/types"

const typeName : any = {
  'login.month' : 'Đăng nhập tháng', 
  'login.total': 'Đăng nhập tổng', 
  'pay.total.money': 'Tích nạp tổng', 
  'pay.day.money': 'Tích nạp ngày', 
  'pay.month.money': 'Tích nạp tháng', 
  'spend.total.coin': 'Tiêu phí tổng',
  'spend.day.coin': 'Tiêu phí ngày',
  'spend.month.coin': 'Tiêu phí tháng',
  'referral.count': 'Giới thiệu bạn'
}

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { _id, gift } = body
    if(!_id || !gift) throw 'Dữ liệu đầu vào không hợp lệ'

    const eventData = await DB.Event.findOne({ _id: _id }).select('need type')
    if(!eventData) throw 'Dữ liệu mốc thưởng không tồn tại'

    const giftFormat = gift.map((i : any) => ({
      item: i._id,
      amount: i.amount
    }))
    
    await DB.Event.updateOne({ _id: _id }, { gift: giftFormat })

    logAdmin(event, `Cập nhật phần thưởng cho mốc <b>${eventData.need}</b> cho sự kiện <b>${typeName[eventData.type]}</b>`)
    return resp(event, { message: 'Sửa phần thưởng mốc thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})