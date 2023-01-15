import { Logger } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'https://localhost:9000',
  },
})
export class ChatGateway {
  @WebSocketServer()
  private server: Server;
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
  ];

  @SubscribeMessage('newMessage')
  newMessage(
    @MessageBody() message: any,
    @ConnectedSocket() socket: Socket
  ): string {
    Logger.log(`[New Message]: ${message}`);
    this.server.to(socket.data.room.label).emit('broadcast', {
      content: message,
      user: socket.data,
      id: Date.now(),
    });
    return message;
  }

  @SubscribeMessage('userConnected')
  userConnected(
    @MessageBody() username: string,
    @ConnectedSocket() socket: Socket
  ): string {
    socket.data = {
      name: username,
      id: socket.id,
      room: null,
    };
    this.server.sockets.emit('userConnected', socket.data);
    socket.emit('rooms', this.rooms);
    Logger.log(`[Connected User]: ${socket.data}`);
    return username;
  }

  private getRoomById(roomId: string): any | null {
    return this.rooms.find((item) => item.id === roomId);
  }

  @SubscribeMessage('joinRoom')
  joinRoom(
    @MessageBody() roomId: any,
    @ConnectedSocket() socket: Socket
  ): string {
    const room = this.getRoomById(roomId);
    socket.data.room = room;
    socket.join(room.label);
    //this.server.sockets.emit('userConnected', socket.data);
    Logger.log(`[Connected User]: ${socket.data}`);
    return roomId;
  }
}
