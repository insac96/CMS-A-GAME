import type { IAuth, IDBLimitedEventPayment } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { need } = body
    if(!need) throw 'Dữ liệu đầu vào không hợp lệ'

    if(
      !!isNaN(parseInt(need))
      || parseInt(need) < 1
    ) throw 'Dữ liệu điều kiện mốc thưởng không hợp lệ'

    const getByNeed = await DB.LimitedEventPayment.findOne({ need: need }).select('_id') as IDBLimitedEventPayment
    if(!!getByNeed) throw 'Điều kiện mốc thưởng đã tồn tại'

    await DB.LimitedEventPayment.create(body)

    logAdmin(event, `Tạo mốc ngày <b>${need}</b> cho sự kiện <b>liên nạp</b>`)

    return resp(event, { message: 'Thêm mốc thưởng thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})