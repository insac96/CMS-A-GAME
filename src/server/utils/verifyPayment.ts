import type { H3Event } from 'h3'
import type { Types } from 'mongoose'
import { IDBGate, IDBLevel, IDBUser } from '~~/types'

interface IBodyData {
  _id: Types.ObjectId,
  status: number,
  money: number,
  reason: string
}

export default async (
  event: H3Event, 
  { _id, status, money, reason } : IBodyData, 
  verifier? : Types.ObjectId,
  sendNotify : boolean = true
) : Promise<void> => {
  if(!_id) throw 'Không tìm thấy ID giao dịch'
  if(
    !!isNaN(parseInt(String(status))) 
    || parseInt(String(status)) < 1 
    || parseInt(String(status)) > 2
  ) throw 'Mã trạng thái không hợp lệ'
  if(
    !!isNaN(parseInt(String(money))) 
    || parseInt(String(money)) < 0 
  ) throw 'Số tiền không hợp lệ'
  if(status == 2 && !reason) throw 'Không tìm thấy lý do từ chối'

  // Set Real Value
  let realNotify
  const realMoney = parseInt(String(money))
  const realStatus = realMoney == 0 ? 2 : status
  const realReason = reason || 'Giao dịch không hợp lệ'

  // Get Payment
  const payment = await DB.Payment
  .findOne({ _id: _id })
  .select('code gate user status')
  if(!payment) throw 'Giao dịch không tồn tại'
  if(payment.status > 0) throw 'Không thể thao tác trên giao dịch này'

  // Get Other
  const user = await DB.User.findOne({ _id: payment.user }).select('level referral') as IDBUser
  if(!user) throw 'Không tìm thấy thông tin tài khoản'
  const level = await DB.Level.findOne({ _id: user.level }).select('bonus bonus_wheel') as IDBLevel
  if(!level) throw 'Không tìm thấy thông tin cấp độ tài khoản'
  const gate = await DB.Gate.findOne({ _id: payment.gate }).select('bonus') as IDBGate
  if(!gate) throw 'Không tìm thấy thông tin kênh nạp'

  // Set Verify Person
  let verify_person
  if(!!verifier){
    verify_person = verifier
  }
  else {
    const bot = await DB.User.findOne({'username': 'bot'}).select('_id')
    verify_person = bot._id
  }
  
  // Update Payment
  await DB.Payment.updateOne({ _id: _id }, {
    money: realMoney,
    status: realStatus,
    verify: {
      person: verify_person,
      time: Date.now(),
      reason: realReason
    }
  })

  // Check Status
  if(realStatus == 1){
    // Bonus Coin
    const levelBonus = parseInt(String(level.bonus))
    const gateBonus = getGateBonus(event, gate.bonus)
    const bonus = Math.floor(realMoney * ((levelBonus + gateBonus) / 100))
    const coin = realMoney + bonus

    // Bonus Wheel
    let bonusWheel : number = 0
    const percentBonusWheel = parseInt(String(level.bonus_wheel))
    if(percentBonusWheel > 0) bonusWheel = Math.floor(realMoney / percentBonusWheel)

    await DB.User.updateOne({ _id: payment.user },{
      $inc: {
        'currency.coin': coin,
        'currency.wheel': bonusWheel,
        'pay.total.money': realMoney,
        'pay.day.money': realMoney,
        'pay.month.money': realMoney,
        'pay.total.count': 1,
        'pay.day.count': 1,
        'pay.month.count': 1,
      }
    })

    realNotify = `
      Bạn được duyệt thành công giao dịch 
      <b>${payment.code}</b> 
      với số tiền 
      <b>${realMoney.toLocaleString('vi-VN')} VNĐ</b> 
      nhận được <b>${coin.toLocaleString('vi-VN')} xu</b>
      từ tiền nạp 
      + <b>${levelBonus}%</b> thưởng cấp độ 
      + <b>${gateBonus}%</b> khuyến mại kênh nạp
    `

    logUser(event, user._id, `Nhận <b>${coin.toLocaleString('vi-VN')} xu, ${bonusWheel.toLocaleString('vi-VN')} lượt quay</b> từ giao dịch nạp tiền thành công <b>${payment.code}</b>`)
    if(!!verifier) return logAdmin(event, `Chấp nhận giao dịch nạp tiền <b>${payment.code}</b> với số tiền <b>${realMoney.toLocaleString('vi-VN')}</b>`, verifier)

    // Update Diamond Referraler
    if(!!user.referral.person){
      const referraler = await DB.User
      .findOne({ _id: user.referral.person })
      .select('level')
      .populate({ path: 'level', select: 'bonus_presentee_pay' })

      if(!!referraler){
        const diamondBonus = parseInt(String(referraler.level.bonus_presentee_pay || 0))
        if(diamondBonus > 0){
          const diamond = Math.floor(realMoney * (diamondBonus / 100))

          await DB.User.updateOne({ _id: referraler._id },{ $inc: { 'currency.diamond': diamond }})
          await sendNotifyUser(event, {
            to: [ referraler._id ],
            type: 2,
            color: 'primary',
            content: `Bạn nhận được <b>${diamond.toLocaleString('vi-VN')} Kim Cương</b> từ giao dịch nạp tiền của bạn bè`
          })
        }
      }
    }
  }
  else {
    realNotify = `Bạn bị từ chối giao dịch <b>${payment.code}</b> với lý do <b>${realReason}</b>`
    if(!!verifier) return logAdmin(event, `Từ chối giao dịch nạp tiền <b>${payment.code}</b> với lý do <b>${realReason}</b>`, verifier)
  }

  // Send Notify
  if(!!sendNotify) await sendNotifyUser(event, {
    to: [ payment.user ],
    type: 2,
    color: realStatus == 1 ? 'green' : 'red',
    content: realNotify
  })
}