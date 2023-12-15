export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth
    if(!auth) throw 'Vui lòng đăng nhập trước'

    const { text } = await readBody(event)
    if(!text) throw 'Vui lòng nhập nội dung'

    await createChat(event, auth._id, text)
    return resp(event, { result: true })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})