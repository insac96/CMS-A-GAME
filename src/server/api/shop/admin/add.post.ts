export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth
    if(!auth) throw 'Vui lòng đăng nhập trước'
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { item, price, limit } = body
    if(!item || !price) throw 'Dữ liệu đầu vào không hợp lệ'
    if(
      !!isNaN(parseInt(price))
      || parseInt(price) < 1
    ) throw 'Giá tiền không hợp lệ'
    if(
      !!isNaN(parseInt(limit))
      || parseInt(limit) < 0
    ) throw 'Giới hạn không hợp lệ'

    const itemData = await DB.Item.findOne({ _id: item }).select('_id')
    if(!itemData) throw 'Vật phẩm không tồn tại'

    const checkDup = await DB.Shop.findOne({ item: item }).select('_id')
    if(!!checkDup) throw 'Vật phẩm cửa hàng đã tồn tại'

    await DB.Shop.create(body)
    return resp(event, { message: 'Thêm vật phẩm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})