import type { H3Event } from 'h3'
import type { IAuth, IDBConfig } from '~~/types'

export default async (event: H3Event, type : string) : Promise<void> => {
  try {
    const auth = event.context.auth as IAuth
    
    const config = await DB.Config.findOne().select('permission') as IDBConfig
    if(!config) throw 'Không tìm thấy cấu hình trang'

    const permission = config.permission
    const typeArray = type.split('.')
    if(typeArray.length != 2) throw 'Kiểu phân quyền không hợp lệ'
    
    // @ts-expect-error
    if(!permission[typeArray[0]]) throw 'Kiểu dữ liệu phân quyền 1 không hợp lệ'

    // @ts-expect-error
    if(!permission[typeArray[0]][typeArray[1]]) throw 'Kiểu dữ liệu phân quyền 2 không hợp lệ'

    // @ts-expect-error
    const arrType = permission[typeArray[0]][typeArray[1]]
    if(!arrType.includes(auth.type)) throw 'Bạn không có quyền thao tác'
  }
  catch (e:any) {
    throw e.toString()
  }
}