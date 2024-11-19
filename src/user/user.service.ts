import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { hash } from 'bcryptjs'

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: CreateUserDto) {
        const { email, name, age, password } = data

        // 복호화가 불가능한 암호화를 진행하여 저장 (12는 비밀번호에 salt를 한 것)
        const pass = await hash(password, 12)

        try {
            return await this.prisma.user.create({
                data: {
                    email,
                    name,
                    age,
                    password: pass,
                },
            })
        } catch (error) {
            throw new ForbiddenException()
        }
    }

    async findAll() {
        try {
            return await this.prisma.user.findMany({
                where: {
                    isDeleted: 'No',
                },
            })
        } catch (error) {
            throw new NotFoundException()
        }
    }

    async findOne(email: string) {
        try {
            return await this.prisma.user.findUnique({
                where: {
                    isDeleted: 'No',
                    email,
                },
            })
        } catch (error) {
            throw new NotFoundException()
        }
    }

    async findId(id: string) {
        try {
            return await this.prisma.user.findUnique({
                where: {
                    isDeleted: 'No',
                    id,
                },
            })
        } catch (error) {
            throw new NotFoundException()
        }
    }

    async update(id: string, data: UpdateUserDto) {
        const user = await this.getUserById(id)

        if (user.isDeleted === 'Yes') {
            throw new ForbiddenException('확인')
        }

        return await this.prisma.user.update({
            where: { id },
            data,
        })
    }

    async remove(id: string) {
        const user = await this.getUserById(id)

        if (user.isDeleted === 'Yes') {
            throw new ForbiddenException('이미 삭제 처리된 사용자입니다.')
        }

        return await this.prisma.user.update({
            where: { id },
            data: { isDeleted: 'Yes' },
        })
    }

    private async getUserById(id: string) {
        try {
            return await this.prisma.user.findFirstOrThrow({
                where: { id },
            })
        } catch (error) {
            throw new ForbiddenException('사용자를 찾을 수 없습니다.')
        }
    }
}
