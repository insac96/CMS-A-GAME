export default defineEventHandler(async (event) => {
  try {
    const { code } = await readBody(event)
    if(!code) throw 'Không tìm thấy mã Tester'

    const tester = await DB.AdsTester
    .findOneAndUpdate({ code: code }, { $inc: { view: 1 } }, { new: true })
    .select('code link')

    if(!tester) throw 'Tester không tồn tại'
    return resp(event, { result: tester })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})