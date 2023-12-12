import md5 from "md5"
import type { IDBGate, IDBLevel, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth
    if(!auth) throw 'Vui lòng đăng nhập trước'

    // Check Body
    const body = await readBody(event)
    const { bank, diamond } = body
    if(!bank || !diamond) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!bank.name || !bank.person || !bank.number) throw 'Thông tin ngân hàng không hợp lệ'
    if(!!isNaN(parseInt(diamond)) || parseInt(diamond) < 1) throw 'Số tiền không hợp lệ'
    if(parseInt(diamond) < 10000) throw 'Số tiền phải lớn hơn hoặc bằng 10.000đ'
    if(parseInt(diamond) % 10000 != 0) return 'Số tiền phải là bội số của 10.000'

    // Check User
    const user = await DB.User.findOne({ _id: auth._id }).select('currency') as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'
    if(user.currency.diamond < parseInt(diamond)) throw 'Số dư cống hiến không đủ'

    // Make Code, Token
    const countWithdraw = await DB.Withdraw.count()
    const code = 'WD' + (countWithdraw > 9 ? countWithdraw : `0${countWithdraw}`) + Math.floor(Math.random() * (99 - 10) + 10)
    
    // Create
    const withdraw = await DB.Withdraw.create({
      user: auth._id,
      bank: bank,
      diamond: parseInt(diamond),
      code: code
    })

    // Update User
    await DB.User.updateOne({ _id: auth._id }, { $inc: { 'currency.diamond': parseInt(diamond) * -1 }})

    return resp(event, { message: 'Tạo giao dịch thành công', result: withdraw._id })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})