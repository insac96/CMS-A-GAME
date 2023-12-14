import { Server as SocketServer } from 'socket.io'

export default (io : SocketServer) => {
  io.on('connection', (socket : any) => {
    socket.on('get-online', () => {
      SocketData.online++
      io.emit('online', SocketData.online)
    })

    socket.on('disconnect', () => {
      SocketData.online = SocketData.online <= 1 ? 1 : SocketData.online - 1
      io.emit('online', SocketData.online)
    })
  })

  global.IO = io
}