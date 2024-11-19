import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'

export class CreateUserDto {
    @ApiProperty({ description: '사용자의 이메일' })
    email: string

    @ApiProperty({ description: '사용자의 이름' })
    name?: string

    @ApiProperty({ description: '사용자의 나이' })
    age?: number

    @ApiProperty({ description: '사용자의 비밀번호' })
    password: string

    // @ApiProperty()
    // @IsEnum(['Yes', 'No'])
    // isDeleted?: 'Yes' | 'No'
}
