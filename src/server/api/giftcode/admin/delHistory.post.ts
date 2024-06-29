import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 3) throw 'Chỉ Admin mới có quyền xóa'

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const histories = await DB.GiftcodeHistory.findOne({ _id: _id })
    if(!histories) throw 'Dữ liệu lịch sử không tồn tại'

    await DB.GiftcodeHistory.deleteOne({ _id: _id })
    return resp(event, { message: 'Xóa dữ liệu thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})