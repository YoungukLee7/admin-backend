import { Injectable, UnauthorizedException } from '@nestjs/common'
import { CreateAuthDto } from './dto/create-auth.dto'
import { UpdateAuthDto } from './dto/update-auth.dto'
import { UserService } from 'src/user/user.service'
import { UserLoginDto } from './dto/userLogin.dto'
import { compare } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'
import { jwtConstants } from './constants'

@Injectable()
export class AuthService {
    constructor(
        private readonly user: UserService,
        private readonly jwtService: JwtService
    ) {}

    async userLogin(userData: UserLoginDto) {
        try {
            // 회원 조회
            const res = await this.user.findOne(userData.email)
            // 회원 존재 여부 확인
            if (!res) {
                throw new UnauthorizedException()
            }
            // 비밀번호 동일 여부 확인 (복호화 불가능한 비밀번호를 조회하는 방법)
            const isValid = await compare(userData.password, res.password)
            if (!isValid) {
                throw new UnauthorizedException()
            }
            // 토큰에 들어갈 데이터 생성
            const respon = { id: res.id }
            // 조회한 데이터를 가지고 access토큰, refresh토큰 생성해서 return
            return {
                accessToken: this.jwtService.sign(respon),
                refreshToken: this.jwtService.sign(respon, { expiresIn: '30d' }),
            }
        } catch (error) {
            throw new Error(error)
        }
    }

    async refreshTokens(refreshToken: string) {
        try {
            // 리프레시 토큰을 검증
            const decoded = await this.jwtService.verifyAsync(refreshToken, { secret: jwtConstants.secret })
            // 리프레시 토큰에서 아이디 가져오기 해석
            const userId = decoded.id
            // 해석한 데이터를 이용하여 조회
            const res = await this.user.findId(userId)
            // 사용자 존재 여부 확인
            if (!res) {
                throw new UnauthorizedException()
            }
            // 토큰에 들어갈 데이터 생성
            const respon = { id: res.id }
            // 조회한 데이터를 가지고 access토큰, refresh토큰 생성해서 return
            return {
                accessToken: this.jwtService.sign(respon),
                refreshToken: this.jwtService.sign(respon, { expiresIn: '30d' }),
            }
        } catch (error) {
            throw new UnauthorizedException()
        }
    }

    async accessTokens(accessToken: string) {
        try {
            // ACCESS 토큰을 검증
            const decoded = await this.jwtService.verifyAsync(accessToken, { secret: jwtConstants.secret })
            // ACCESS 토큰을 해석
            const userId = decoded.id
            // 해석한 데이터를 이용하여 회원정보 조회
            const res = await this.user.findId(userId)
            // 사용자 존재 여부 확인
            if (!res) {
                throw new UnauthorizedException('존재가 없어?')
            }
            const respon = {
                id: res.id,
                email: res.email,
                name: res.name,
                age: res.age,
                isDeleted: res.isDeleted,
            }
            return respon
        } catch (error) {
            throw new UnauthorizedException('그냥 에러야?')
        }
    }

    create(createAuthDto: CreateAuthDto) {
        return 'This action adds a new auth'
    }

    findAll() {
        return `This action returns all auth`
    }

    findOne(id: number) {
        return `This action returns a #${id} auth`
    }

    update(id: number, updateAuthDto: UpdateAuthDto) {
        return `This action updates a #${id} auth`
    }

    remove(id: number) {
        return `This action removes a #${id} auth`
    }
}
