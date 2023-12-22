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

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const eventData = await DB.Event.findOne({ _id: _id }).select('need type')
    if(!eventData) throw 'Dữ liệu mốc thưởng không tồn tại'
    
    const histories = await DB.EventHistory.count({ event: _id })
    if(histories > 0) throw 'Không thể xóa mốc thưởng đã có dữ liệu lịch sử'

    await DB.Event.deleteOne({ _id: _id })

    logAdmin(event, `Sửa mốc <b>${eventData.need}</b> cho sự kiện <b>${typeName[eventData.type]}</b>`)
    return resp(event, { message: 'Xóa mốc thưởng thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})