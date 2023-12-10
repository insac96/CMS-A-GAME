import type { H3Event } from 'h3'
import type { Types } from 'mongoose'
import { IDBUser, IDBWithdraw } from '~~/types'

interface IBodyData {
  _id: Types.ObjectId,
  status: number,
  reason: string
}

export default async (
  event: H3Event, 
  { _id, status, reason } : IBodyData, 
  verifier? : Types.ObjectId,
  sendNotify : boolean = true
) : Promise<void> => {
  if(!_id) throw 'Không tìm thấy ID giao dịch'
  if(
    !!isNaN(parseInt(String(status))) 
    || parseInt(String(status)) < 1 
    || parseInt(String(status)) > 2
  ) throw 'Mã trạng thái không hợp lệ'

  // Set Real Value
  let realNotify
  const realStatus = parseInt(String(status))
  const realReason = reason || 'Giao dịch không hợp lệ'

  // Get Withdraw
  const withdraw = await DB.Withdraw
  .findOne({ _id: _id })
  .select('code user diamond status') as IDBWithdraw
  if(!withdraw) throw 'Giao dịch không tồn tại'
  if(withdraw.status > 0) throw 'Không thể thao tác trên giao dịch này'

  // Get User
  const user = await DB.User.findOne({ _id: withdraw.user }).select('_id') as IDBUser
  if(!user) throw 'Không tìm thấy thông tin tài khoản'

  // Set Verify Person
  let verify_person
  if(!!verifier){
    verify_person = verifier
  }
  else {
    const bot = await DB.User.findOne({'username': 'bot'}).select('_id')
    verify_person = bot._id
  }

  // Update Withdraw
  await DB.Withdraw.updateOne({ _id: _id }, {
    status: realStatus,
    verify: {
      person: verify_person,
      time: Date.now(),
      reason: realReason
    }
  })

  // Check Status
  if(realStatus == 1){
    realNotify = `
      Bạn được duyệt thành công giao dịch rút tiền 
      <b>${withdraw.code}</b>
      . Vui lòng kiểm tra tài khoản ngân hàng số tiền
      <b>${withdraw.diamond.toLocaleString('vi-VN')}</b>
    `

    if(!!verifier) return logAdmin(event, `Chấp nhận giao dịch rút tiền <b>${withdraw.code}</b> với số tiền <b>${withdraw.diamond.toLocaleString('vi-VN')}</b>`, verifier)
  }

  else {
    await DB.User.updateOne({ _id: withdraw.user }, { $inc: { 'currency.diamond': withdraw.diamond }})

    realNotify = `
      Bạn bị từ chối giao dịch rút tiền 
      <b>${withdraw.code}</b> 
      với lý do 
      <b>${realReason}</b> 
      và được hoàn về 
      <b>${withdraw.diamond.toLocaleString('vi-VN')}</b>
      điểm cống hiến
    `

    logUser(event, withdraw.user, `Hoàn <b>${withdraw.diamond.toLocaleString('vi-VN')} cống hiến</b> từ giao dịch rút tiền thất bại <b>${withdraw.code}</b>`)
    if(!!verifier) return logAdmin(event, `Từ chối giao dịch rút tiền <b>${withdraw.code}</b> với lý do <b>${realReason}</b>`, verifier)
  }

  // Send Notify
  if(!!sendNotify) await sendNotifyUser(event, {
    to: [ withdraw.user ],
    type: 2,
    color: realStatus == 1 ? 'green' : 'red',
    content: realNotify
  })
}