export default defineEventHandler(async (event) => {
  try {
    const list = await DB.SocketChat
    .find({})
    .select('-updatedAt')
    .populate({ path: 'user', select: 'username avatar type' })
    .sort({ createdAt: -1 })
    .limit(10)

    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})