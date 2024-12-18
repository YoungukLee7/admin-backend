import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { FileModule } from './file/file.module'
import { BoardModule } from './board/board.module'

@Module({
    imports: [UserModule, PrismaModule, AuthModule, FileModule, BoardModule],
    controllers: [AppController],
    providers: [AppService],
    exports: [AppService],
})
export class AppModule {}
