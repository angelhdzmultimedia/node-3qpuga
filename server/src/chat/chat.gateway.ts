import { Logger } from '@nestjs/common'
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets'
import { Socket, Server } from 'socket.io'
import { ChatCommandService } from '../chat-command/chat-command.service'

@WebSocketGateway({
  cors: {
    origin: 'https://localhost:9000',
  },
})
export class ChatGateway {
  @WebSocketServer()
  private server: Server
  private rooms = [
    {
      id: 'room001',
      label: 'Lobby',
      locked: false,
    },

    {
      id: 'room002',
      label: 'Staff',
      locked: true,
    },
  ]

  constructor(private chatCommandService: ChatCommandService) {}

  private async getUsersInRoom(roomLabel: string): Promise<string[]> {
    const sockets = await this.server.sockets.in(roomLabel).fetchSockets()
    return sockets.map((socket) => socket.data.name)
  }

  @SubscribeMessage('newMessage')
  private async newMessage(
    @MessageBody() message: any,
    @ConnectedSocket() socket: Socket,
  ): Promise<string> {
    Logger.log(`[New Message]: ${message}`)

    if (this.chatCommandService.isChatCommand(message)) {
      await this.chatCommandService.executeChatCommand(
        message,
        socket,
        this.server,
      )
      return message
    }

    // Is not a chat command
    this.server.to(socket.data.room.label).emit('broadcast', {
      content: message,
      user: socket.data,
      id: Date.now(),
    })
    return message
  }

  @SubscribeMessage('userConnected')
  userConnected(
    @MessageBody() username: string,
    @ConnectedSocket() socket: Socket,
  ): string {
    socket.data = {
      name: username,
      id: socket.id,
      room: null,
    }
    this.server.sockets.emit('userConnected', socket.data)
    socket.emit('rooms', this.rooms)
    Logger.log(`[Connected User]: ${socket.data}`)
    return username
  }

  private getRoomById(roomId: string): any | null {
    return this.rooms.find((item) => item.id === roomId)
  }

  @SubscribeMessage('joinRoom')
  private async joinRoom(
    @MessageBody() roomId: any,
    @ConnectedSocket() socket: Socket,
  ): Promise<string> {
    const room = this.getRoomById(roomId)
    socket.data.room = room
    socket.join(room.label)
    this.server.sockets
      .to(room.label)
      .emit('users', await this.getUsersInRoom(room.label))

    this.server.sockets.to(room.label).emit('notify', {
      content: `${socket.data.name} joined the room.`,
      user: null,
    })
    Logger.log(`[Join Room]: ${roomId}`)
    return roomId
  }

  @SubscribeMessage('leaveRoom')
  private async leaveRoom(
    @MessageBody() roomId: any,
    @ConnectedSocket() socket: Socket,
  ): Promise<string> {
    const room = this.getRoomById(roomId)
    socket.data.room = null
    socket.leave(room.label)
    this.server.sockets
      .to(room.label)
      .emit('users', await this.getUsersInRoom(room.label))

    this.server.sockets.to(room.label).emit('notify', {
      content: `${socket.data.name} left the room.`,
      user: null,
    })
    Logger.log(`[Leave Room]: ${roomId}`)
    return roomId
  }
}
