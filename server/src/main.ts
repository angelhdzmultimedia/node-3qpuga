import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

if (import.meta.env.PROD) {
  async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.enableCors({
      origin: 'http://localhost:9000',
    })
    await app.listen(5000)
  }
  bootstrap()
}

export const viteNodeApp = NestFactory.create(AppModule)
