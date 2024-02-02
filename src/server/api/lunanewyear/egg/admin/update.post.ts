import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const data = await readBody(event)
    const { price, row1, row2, row3, row4, row5 } = data
    if(!price || !row1 || !row2 || !row3 || !row4 || !row5) throw 'Dữ liệu đầu vào không hợp lệ'
  
    if(
      !!isNaN(parseInt(price)) 
      || parseInt(price) < 1
    ) throw 'Dữ liệu giá tiền không hợp lệ'

    data.row1 = row1.map((i : any) => ({
      item: i._id,
      amount: i.amount,
      percent: i.percent
    }))
    data.row2 = row2.map((i : any) => ({
      item: i._id,
      amount: i.amount,
      percent: i.percent
    }))
    data.row3 = row3.map((i : any) => ({
      item: i._id,
      amount: i.amount,
      percent: i.percent
    }))
    data.row4 = row4.map((i : any) => ({
      item: i._id,
      amount: i.amount,
      percent: i.percent
    }))
    data.row5 = row5.map((i : any) => ({
      item: i._id,
      amount: i.amount,
      percent: i.percent
    }))

    delete data['_id']
    await DB.LunaEgg.updateMany({}, data)

    logAdmin(event, `Cập nhật cấu hình <b>đập trứng tết</b>`)
    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})