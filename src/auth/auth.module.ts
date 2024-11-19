import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UserModule } from 'src/user/user.module'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from './constants'
import { JwtAuthGuard } from './jwt-auth.guard'
import { JwtStrategy } from './jwt.strategy'
import { APP_GUARD } from '@nestjs/core'

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: jwtConstants.expireIn },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtAuthGuard, JwtStrategy, { provide: APP_GUARD, useClass: JwtAuthGuard }],
    exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
