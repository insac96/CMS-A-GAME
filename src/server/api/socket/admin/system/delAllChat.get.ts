export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth
    if(!auth) throw 'Vui lòng đăng nhập trước'
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    await DB.SocketChat.deleteMany({})
    await createChat(event, 'bot', 'Để lại lời nhắn, cùng nhau trò chuyện với mọi người nhé...')
    IO.emit('chat-reload')
    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})