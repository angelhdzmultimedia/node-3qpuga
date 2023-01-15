import { Injectable } from '@nestjs/common'
import { Server, Socket } from 'socket.io'
import { ChatCommand } from '../types/chat-command'

@Injectable()
export class ChatCommandService {
  private chatCommands = ['kick']

  private parseChatCommand(message: string): ChatCommand {
    let newChatCommand: ChatCommand | null = null

    for (const chatCommand of this.chatCommands) {
      if (this.hasChatCommand(message, chatCommand)) {
        const rawArgs = message.replace(`/${chatCommand} `, '')
        newChatCommand = {
          alias: chatCommand,
          rawArgs,
        }
      }
    }
    return newChatCommand
  }

  private hasChatCommand(message: string, alias: string): boolean {
    return message.startsWith(`/${alias}`)
  }

  public isChatCommand(message: string): boolean {
    return message.startsWith('/')
  }

  public async executeChatCommand(
    message: string,
    socket: Socket,
    server: Server,
  ): Promise<void> {
    const chatCommand: ChatCommand = this.parseChatCommand(message)
    await this[chatCommand.alias].apply(this, [
      chatCommand,
      message,
      socket,
      server,
    ])
  }

  private async kick(
    chatCommand: ChatCommand,
    message: string,
    socket: Socket,
    server: Server,
  ): Promise<void> {
    const username: string = chatCommand.rawArgs
    const sockets = await server.sockets.fetchSockets()
    const foundSocket: any | null = sockets.find((socket) => {
      return socket.data.name === username
    })

    if (!foundSocket) return
    const room = foundSocket.data.room
    foundSocket.leave(room.label)
    foundSocket.data.room = null

    foundSocket.emit('kicked', {
      content: 'You have been kicked!',
      user: foundSocket.data,
    })
    server.sockets.to(room.label).emit('notifyModeration', {
      content: `${foundSocket.data.name} was kicked from the room!`,
      user: null,
    })
  }
}
