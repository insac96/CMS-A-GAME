export default defineEventHandler(async (event) => {
  try {
    const { code } = await readBody(event)
    if(!code) throw 'Không tìm thấy mã Teaser'

    const teaser = await DB.AdsTeaser
    .findOneAndUpdate({ code: code }, { $inc: { view: 1 } }, { new: true })
    .select('code link')

    if(!teaser) throw 'Teaser không tồn tại'
    return resp(event, { result: teaser })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})