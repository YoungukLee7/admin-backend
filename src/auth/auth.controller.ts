import { Controller, Get, Post, Body, Patch, Param, Delete, Options, Request, Put } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UpdateAuthDto } from './dto/update-auth.dto'
import { UserLoginDto } from './dto/userLogin.dto'
import { Public } from './public.decorator'
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @Post('login')
    @ApiBody({
        type: UserLoginDto,
        description: '사용자 로그인 데이터',
        examples: {
            example1: {
                summary: '로그인',
                value: {
                    email: 'test@test',
                    password: '1234',
                },
            },
        },
    }) // body에 들어갈 예시 데이터들 정의
    async userLogin(@Body() userLoginDto: UserLoginDto) {
        return await this.authService.userLogin(userLoginDto)
    }

    @Public()
    @Post('refresh-token:refreshToken')
    async refreshToken(@Param('refreshToken') refreshToken: string) {
        return await this.authService.refreshTokens(refreshToken)
    }

    @Get('access-token')
    @ApiBearerAuth() // 스웨거에서 가드를 이용할 때 사용하는 어노테이션
    async accessToken(@Request() req) {
        // access-token을 @Request 헤더에서 가져와 작업 진행
        // (@Request는 모든 요청을 가져온다. 나중에 log를 가져와 저장하는 것도 @Request를 이용한다.)
        const authHeader = req.headers['authorization']
        let token = ''
        if (authHeader.startsWith('Bearer')) {
            // split으로 띄워주는 이유는 Bearer에서 한칸 띄고 access-token이 있기 때문이다.
            token = authHeader.split(' ')[1]
        }

        return await this.authService.accessTokens(token)
    }

    @Put()
    update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
        return this.authService.update(+id, updateAuthDto)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.authService.remove(+id)
    }
}
