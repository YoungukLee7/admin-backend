import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    const config = new DocumentBuilder() //
        .setTitle('Test API') // 제목
        .setDescription('The Test API description') // 설명
        .setVersion('1.0') // 버전
        .addTag('Test') // 순서
        .addTag('User') // ...
        .addBearerAuth() // 상단 토큰
        .build()

    const documentFactory = () => SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api', app, documentFactory)

    await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
