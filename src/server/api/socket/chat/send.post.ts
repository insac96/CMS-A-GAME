export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth
    if(!auth) throw 'Vui lòng đăng nhập trước'

    const { text } = await readBody(event)
    if(!text) throw 'Vui lòng nhập nội dung'

    const user = await DB.User.findOne({ _id: auth._id }).select('username avatar type')

    const chat = await DB.SocketChat.create({
      user: user._id,
      text: text
    })

    IO.emit('chat-push', {
      _id: chat._id,
      user: user,
      text: text
    })

    return resp(event, { result: true })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})