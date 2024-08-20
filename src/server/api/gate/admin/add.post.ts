import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'gate.add')

    const body = await readBody(event)
    const { type, name, person, number, bonus } = body
    if(!type || !name || !person || !number || !bonus || !bonus.limit) throw 'Dữ liệu đầu vào không hợp lệ'
    if(type < 1 || type > 3) throw 'Dữ liệu đầu vào không hợp lệ'
    if(
      !!isNaN(parseInt(bonus.default))
      || !!isNaN(parseInt(bonus.limit.number))
      || parseInt(bonus.default) < 0
      || parseInt(bonus.limit.number) < 0
    ) throw 'Dữ liệu đầu vào không hợp lệ'

    await DB.Gate.create(body)

    logAdmin(event, `Thêm kênh nạp <b>${name}</b>`)
    return resp(event, { message: 'Thêm kênh thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})