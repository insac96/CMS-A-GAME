import type { IAuth } from "~~/types"

const typeList = [
  'login.month', 'login.total', 
  'pay.total.money', 'pay.day.money', 'pay.month.money',
  'spend.total.coin', 'spend.day.coin', 'spend.month.coin',
  'referral.count'
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
  'referral.count': 'Giới thiệu bạn'
}

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { type, need } = body
    if(!type) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!typeList.includes(type)) throw 'Kiểu sự kiện không hỗ trợ'

    if(
      !!isNaN(parseInt(need)) 
      || parseInt(need) < 0
    ) throw 'Dữ liệu điều kiện mốc thưởng không hợp lệ'

    const getByNeed = await DB.Event.findOne({ need: need, type: type }).select('_id')
    if(!!getByNeed) throw 'Điều kiện mốc thưởng đã tồn tại'

    await DB.Event.create(body)

    logAdmin(event, `Tạo mốc <b>${need}</b> cho sự kiện <b>${typeName[type]}</b>`)

    return resp(event, { message: 'Thêm mốc thưởng thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})