import { Controller, Get } from '@nestjs/common'
import { Redirect } from '@nestjs/common/decorators'

@Controller('')
export class AppController {
  @Get()
  @Redirect(
    'https://node3qpuga-vcio--9000.local-credentialless.webcontainer.io',
  )
  public index(): string {
    return 'Hello world'
  }
}
