import type { IAuth, IDBLunaPayment } from "~~/types"

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

    const getByNeed = await DB.LunaPayment.findOne({ need: need }).select('_id') as IDBLunaPayment
    if(!!getByNeed) throw 'Điều kiện mốc thưởng đã tồn tại'

    await DB.LunaPayment.create(body)

    logAdmin(event, `Tạo mốc ngày <b>${need}</b> cho sự kiện <b>liên nạp tết</b>`)

    return resp(event, { message: 'Thêm mốc thưởng thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})