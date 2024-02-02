import type { IAuth, IDBLunaPayment } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { _id, gift } = body
    if(!_id || !gift) throw 'Dữ liệu đầu vào không hợp lệ'

    const eventData = await DB.LunaPayment.findOne({ _id: _id }).select('need type') as IDBLunaPayment
    if(!eventData) throw 'Dữ liệu mốc thưởng không tồn tại'

    const giftFormat = gift.map((i : any) => ({
      item: i._id,
      amount: i.amount
    }))
    
    await DB.LunaPayment.updateOne({ _id: _id }, { gift: giftFormat })

    logAdmin(event, `Cập nhật phần thưởng cho mốc <b>${eventData.need}</b> cho sự kiện <b>liên nạp tết</b>`)
    return resp(event, { message: 'Sửa phần thưởng mốc thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})