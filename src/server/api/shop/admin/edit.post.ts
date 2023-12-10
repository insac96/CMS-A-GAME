import { IDBShop, IDBItem } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth
    if(!auth) throw 'Vui lòng đăng nhập trước'
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { _id, price, limit } = body
    if(!_id || !price) throw 'Dữ liệu đầu vào không hợp lệ'
    if(
      !!isNaN(parseInt(price))
      || parseInt(price) < 1
    ) throw 'Giá tiền không hợp lệ'
    if(
      !!isNaN(parseInt(limit))
      || parseInt(limit) < 0
    ) throw 'Giới không hợp lệ'

    const shopItem = await DB.Shop.findOne({ _id: _id }).select('item') as IDBShop
    if(!shopItem) throw 'Vật phẩm không tồn tại'

    const itemData = await DB.Item.findOne({ _id: shopItem.item }).select('item_name') as IDBItem

    delete body['_id']
    await DB.Shop.updateOne({ _id: _id }, body)

    logAdmin(event, `Sửa thông tin vật phẩm <b>${itemData.item_name}</b> ở cửa hàng`)
    
    return resp(event, { message: 'Sửa vật phẩm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})