import { Types } from "mongoose"

export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth
    if(!auth) throw 'Vui lòng đăng nhập trước'
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { _id, gift } = body
    if(!_id || !gift) throw 'Dữ liệu đầu vào không hợp lệ'

    const giftcode = await DB.Giftcode.findOne({ _id: _id }).select('code')
    if(!giftcode) throw 'Mã không tồn tại'

    await DB.Giftcode.updateOne({ _id: _id }, { gift: gift })

    logAdmin(event, `Sửa phần thưởng Giftcode <b>${giftcode.code}</b>`)
    return resp(event, { message: 'Sửa mã thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})