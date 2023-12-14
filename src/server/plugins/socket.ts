declare global {
  var SocketData: {
    online: number
  }
}

export default defineNitroPlugin(async (nitroApp) => {
  global.SocketData = {
    online: 0
  }
})