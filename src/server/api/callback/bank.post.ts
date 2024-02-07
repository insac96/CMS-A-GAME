import md5 from "md5"
import type { IDBGate, IDBPayment } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    // 'fullID'        => $fullTransID,   // lowercase: pay1212
    // 'transID'       => $id,            // number from fullID: 1212
    // 'partnerNum'    => $bankNo,        // stk bank
    // 'partnerID'     => $bankRef,       // MGD Bank
    // 'amount'        => $amount,        // thực nhận
    // 'desc'          => $des,           // nội dung ck
    // 'time'          => $time,          // thời gian thực hiện callback. type: int
    // 'sign'          => $sign           // md5(fullID + partnerID + amount + time + signKey)

    const formData = await readMultipartFormData(event)
    const body : any = {}
    formData.forEach((i : any) => {
	    if(i.name && i.data){
	    	const b = Buffer.from(i.data.data)
	    	body[i.name] = b.toString()
	    }
    })	  

    const bot = await DB.User.findOne({ username: 'bot' }).select('_id')
    if(!!bot){
      await logAdmin(event, JSON.stringify(body), bot._id)
    }
	  
    const { fullID, partnerID, partnerNum, desc, time, sign, amount } = body
    if(!fullID || !partnerID || !partnerNum || !desc || !time || !sign || !amount) throw 'Không có quyền quy cập'

    // Get Gate
    const gate = await DB.Gate.findOne({ number: partnerNum }).select('key') as IDBGate
    if(!gate) throw 'Kênh nạp không tồn tại'
    if(!gate.key) throw 'Kênh chưa hỗ trợ tự động duyệt'
    
    const verifySign = md5(fullID+partnerID+amount+time+gate.key)
    if(verifySign != sign) throw 'Mã xác thực không chính xác'

    const code = desc.trim().toUpperCase()
	const money = Number(amount)
    const status = (!money || money == 0) ? 2 : 1 // 1 Success, 2 Refuse

    const payment = await DB.Payment.findOne({ code: code }).select('_id') as IDBPayment
    if(!payment) throw 'Giao dịch không tồn tại'

    await verifyPayment(event, {
      _id: payment._id,
      status: status,
      money: money,
      reason: 'Không thể xác thực giao dịch'
    })

    resp(event, { message: 'Xử lý thành công' })
  } 
  catch (e:any) {
    setResponseStatus(event, 500)
    return {
      message: e.toString()
    }
  }
})
