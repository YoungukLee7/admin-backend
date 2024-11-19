import { PartialType, ApiProperty } from '@nestjs/swagger'
import { CreateUserDto } from './create-user.dto'
import { IsEnum, IsUUID } from 'class-validator'

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty({ description: '아이디' })
    @IsUUID() // UUID인지 검증
    id: string

    @ApiProperty({ description: '사용자의 이메일' })
    email: string

    @ApiProperty({ description: '사용자의 이름' })
    name?: string

    @ApiProperty({ description: '사용자의 나이' })
    age?: number

    @ApiProperty()
    @IsEnum(['Yes', 'No'])
    isDeleted?: 'Yes' | 'No'
}
