export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth
    if(!auth) throw 'Vui lòng đăng nhập trước'

    const { _id } = await readBody(event)
    if(!_id) throw 'Không tìm thấy ID giao dịch'

    const payment = await DB.Payment.findOne({ _id: _id })
    .select('-token')
    .populate({
      path: 'gate', select: 'type name person number bonus'
    })

    if(!payment) throw 'Giao dịch không tồn tại'
    if(payment.user.toString() !== auth._id.toString()) throw 'Bạn không phải chủ giao dịch'

    return resp(event, { result: payment })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})