import type { IAuth } from "~~/types"
import excelJS from 'exceljs'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const workbook = new excelJS.Workbook()
    const worksheet = workbook.addWorksheet('Items')

    worksheet.columns = [ 
      { header: "ID", key: "item_id", width: 10 }, 
      { header: "Name", key: "item_name", width: 30 }, 
    ]

    const items = await DB.Item.find({ type: 'game_item' }).select('item_id item_name')
    items.forEach(item => { worksheet.addRow(item) })

    const createdAt = formatDate(event, new Date())
    const filename = `excel-items-${createdAt.day}${createdAt.month}${createdAt.year}-${createdAt.hour}-${createdAt.minute}-${createdAt.timestamp}.xlsx`
    const filePath = join('dist/excel', filename)
    await workbook.xlsx.writeFile(filePath) as any

    return resp(event, { result: `/excel/${filename}` })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})