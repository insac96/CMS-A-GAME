export default defineEventHandler(async (event) => {
  try {
    const config = await DB.Config.findOne().select('about contact social.zalo social.facebook social.messenger') 
    if(!config) throw 'Không tìm thấy cấu hình trang'

    return resp(event, { result: config })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})