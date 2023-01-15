import { Module } from '@nestjs/common'
import { ChatCommandModule } from '../chat-command/chat-command.module'
import { ChatCommandService } from '../chat-command/chat-command.service'
import { ChatGateway } from './chat.gateway'

@Module({
  imports: [ChatCommandModule],
  providers: [ChatGateway, ChatCommandService],
})
export class ChatModule {}
