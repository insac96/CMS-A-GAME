import { IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth
    if(!auth) throw 'Vui lòng đăng nhập trước'
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { user, server, role, title, content, reason, items } = body
    if(!user || !server || !role || !reason || !Array.isArray(items)) throw 'Dữ liệu đầu vào không hợp lệ'
    if(items.length < 1) throw 'Dữ liệu vật phẩm không hợp lệ'

    const userData = await DB.User.findOne({ _id: user }).select('_id username') as IDBUser
    if(!userData) throw 'Tài khoản không tồn tại'

    const itemSend = items.map(i => ({
      id: i.item_id,
      amount: i.amount
    }))
    
    await gameSendMail(event, {
      account: userData.username,
      server_id: server,
      role_id: role,
      title: title || 'GM Send',
      content: content || 'Vật phẩm gửi từ GM',
      items: itemSend
    })

    await DB.LogAdminSendItem.create({
      from: auth._id,
      to: userData._id,
      server: server,
      role: role,
      reason: reason
    })

    return resp(event, { message: 'Gửi thành công thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})