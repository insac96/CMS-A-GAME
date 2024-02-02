import type { IAuth, IDBLunaPayment } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { _id, need } = body
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    if(
      !!isNaN(parseInt(need)) 
      || parseInt(need) < 0
    ) throw 'Dữ liệu điều kiện mốc thưởng không hợp lệ'

    const eventData = await DB.LunaPayment.findOne({ _id: _id }).select('type need') as IDBLunaPayment
    if(!eventData) throw 'Dữ liệu mốc thưởng không tồn tại'

    if(eventData.need != need){
      const getByNeed = await DB.LunaPayment.findOne({ need: need }).select('_id')
      if(!!getByNeed) throw 'Điều kiện mốc thưởng đã tồn tại'
    }

    delete body['_id']
    await DB.LunaPayment.updateOne({ _id: _id }, body)

    logAdmin(event, `Sửa mốc <b>${eventData.need}</b> cho sự kiện <b>liên nạp tết</b>`)

    return resp(event, { message: 'Sửa mốc thưởng thành công' })
  }
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})