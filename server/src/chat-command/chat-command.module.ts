import { Module } from '@nestjs/common'
import { ChatCommandService } from './chat-command.service'

@Module({
  providers: [ChatCommandService],
})
export class ChatCommandModule {}
