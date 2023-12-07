import type { IDBUser, IDBLevel, IDBDice } from "~~/types"

const randomNumber = (min : number, max : number) : number => {
  return Math.floor(Math.random() * (max - min) + min)
}

const isJarSix = (dices : Array<number>) => {
  if(dices[0] == 6 && dices[1] == 6 && dices[2] == 6) return true
  return false
}

const isJarOther = (dices : Array<number>) => {
  let is = false
  const arr = [1,2,3,4,5]
  arr.forEach(i => {
    if(dices[0] == i && dices[1] == i && dices[2] == i){
      is = true
    }
  })

  return is
}

const getDicesPlay = (body : any) : any => {
  if(!!body.dice1 && (!!isNaN(parseInt(body.dice1)) || parseInt(body.dice1) < 0)) return null
  if(!!body.dice2 && (!!isNaN(parseInt(body.dice2)) || parseInt(body.dice2) < 0)) return null 
  if(!!body.dice3 && (!!isNaN(parseInt(body.dice3)) || parseInt(body.dice3) < 0)) return null 
  if(!!body.dice4 && (!!isNaN(parseInt(body.dice4)) || parseInt(body.dice4) < 0)) return null 
  if(!!body.dice5 && (!!isNaN(parseInt(body.dice5)) || parseInt(body.dice5) < 0)) return null 
  if(!!body.dice6 && (!!isNaN(parseInt(body.dice6)) || parseInt(body.dice6) < 0)) return null 

  const dicesPlay = {
    1: parseInt(body.dice1 || '0'),
    2: parseInt(body.dice2 || '0'),
    3: parseInt(body.dice3 || '0'),
    4: parseInt(body.dice4 || '0'),
    5: parseInt(body.dice5 || '0'),
    6: parseInt(body.dice6 || '0')
  }

  return dicesPlay
}

const getTotalCoinPlay = (dicesPlay : any) : number => {
  let money = 0
  for (let i = 1; i <= 6; i++) {
    money = money + dicesPlay[i]
  }
  return money
} 

const getRandomDices = ({ six, other } : IDBDice['percent']) => {
  const dices = []
  dices.push(randomNumber(1,6))
  dices.push(randomNumber(1,6))
  dices.push(randomNumber(1,6))

  if(!!isJarSix(dices)){
    const rand = randomNumber(1,100)
    if(rand <= six) return dices
    return [randomNumber(1,2), randomNumber(3,6), randomNumber(3,6)]
  }

  if(!!isJarOther(dices)){
    const rand = randomNumber(1,100)
    if(rand <= other) return dices
    return [randomNumber(3,6), randomNumber(3,6), randomNumber(1,2)]
  }

  return dices
}

export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth
    if(!auth) throw 'Vui lòng đăng nhập trước'

    throw 'Xúc xắc đang bảo trì, vui lòng quay lại sau'

    const body = await readBody(event)

    // Make Coin Play
    const dicesPlay = getDicesPlay(body)
    if(!dicesPlay) throw 'Dữ liệu đặt cược sai' 
    const coinPlay = getTotalCoinPlay(dicesPlay)
    if(coinPlay < 1) throw 'Dữ liệu đặt cược sai' 

    // Get Config
    const config = await DB.Dice.findOne() as IDBDice
    if(!config) throw 'Không tìm thấy cấu hình xúc xắc'
    
    // Get User
    const user = await DB.User.findOne({ _id: auth._id }).select('currency.coin level dice') as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'
    if(coinPlay > user.currency.coin) throw 'Số dư xu không đủ'

    const level = await DB.Level.findOne({ _id: user.level }).select('limit.dice') as IDBLevel
    if(!level) throw 'Không tìm thấy thông tin cấp độ'

    // Check Limit
    const diceUser = user.dice
    const limit = level.limit.dice
    const limitCoinDay = limit.day.coin == 0 ? -1 : (limit.day.coin - diceUser.day.coin) < 0 ? 0 : (limit.day.coin - diceUser.day.coin)
    const limitCountDay = limit.day.count == 0 ? -1 : (limit.day.count - diceUser.day.count) < 0 ? 0 : (limit.day.count - diceUser.day.count)
    const limitCoinMonth = limit.month.coin == 0 ? -1 : (limit.month.coin - diceUser.month.coin) < 0 ? 0 : (limit.month.coin - diceUser.month.coin)
    const limitCountMonth = limit.month.count == 0 ? -1 : (limit.month.count - diceUser.month.count) < 0 ? 0 : (limit.month.count - diceUser.month.count)
  
    if(limitCountDay != -1 && limitCountDay <= 0) throw 'Bạn đã hết lượt chơi hôm nay'
    if(limitCoinDay != -1 && limitCoinDay <= 0) throw 'Bạn đã đạt giới hạn xu chơi hôm nay'
    if(limitCoinDay != -1 && coinPlay > limitCoinDay) throw `Hôm nay bạn chỉ có thể chơi tối đa ${limitCoinDay.toLocaleString("vi-VN")} Xu`
    if(limitCountMonth != -1 && limitCountMonth <= 0) throw 'Bạn đã hết lượt chơi tháng này'
    if(limitCoinMonth != -1 && limitCoinMonth <= 0) throw 'Bạn đã đạt giới hạn xu chơi tháng này'
    if(limitCoinMonth != -1 && coinPlay > limitCoinMonth) throw `Tháng này bạn chỉ có thể chơi tối đa ${limitCoinMonth.toLocaleString("vi-VN")} Xu`

    // Make Dices
    const dices = getRandomDices(config.percent)

    // Make Coin Receive
    let coinReceive = 0
    dices.forEach((dice : number) => coinReceive = coinReceive + (dicesPlay[dice] * 2))
    coinReceive = Math.floor(coinReceive * 70 / 100)
    coinReceive = coinReceive - coinPlay

    // Make Coin Jar
    const jar = config.jar
    let coinJar = 0
    let coinJarPlus = 0
    if(!!isJarSix(dices)){
      coinJar = jar.now
      coinJar = Math.floor(coinJar * 70 / 100)
      coinJarPlus = jar.now * -1
    }
    else if(!!isJarOther(dices)){
      coinJar = Math.floor(jar.now * 5 / 100)
      coinJar = Math.floor(coinJar * 70 / 100)
      coinJarPlus = coinJar * -1
    }
    else {
      coinJar = 0
      if(coinReceive < 0) coinJarPlus = coinReceive * -1
      else coinJarPlus = 0
    }
  
    // Make Coin Receive Total
    coinReceive = coinReceive + coinJar

    // Update User
    await DB.User.updateOne({ _id: auth._id }, { 
      $inc: { 
        'currency.coin': coinReceive,
        'dice.total.coin': coinPlay,
        'dice.day.coin': coinPlay,
        'dice.month.coin': coinPlay,
        'dice.total.count': 1,
        'dice.day.count': 1,
        'dice.month.count': 1,
      }
    })

    // Update Jar Dice
    await DB.Dice.updateMany({}, { $inc: { 'jar.now': coinJarPlus }})
    await DB.Dice.updateMany({
      'jar.now' : { $lt: jar['default'] }
    }, {
      'jar.now' : jar['default']
    })

    // History
    await DB.DiceHistory.create({
      user: auth._id,
      dices: dices,
      coin: {
        play: coinPlay,
        receive: coinReceive,
        jar: coinJar
      }
    })

    // Log User
    if(coinReceive > 0){
      logUser(event, auth._id, `Nhận <b>${coinReceive.toLocaleString('vi-VN')}</b> xu từ <b>xúc xắc may mắn</b>`)
    }

    // Result
    const newConfig = await DB.Dice.findOne().select('jar.now')
    return resp(event, { result: {
      dices: dices,
      jar: newConfig.jar.now
    }})
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})