import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsInt, IsOptional, Max, Min } from 'class-validator'

export class UserResponseDto {
    @IsEmail() // 이메일 인증
    @ApiProperty({ description: '사용자의 이메일' })
    email: string

    @IsOptional() // 선택적으로 입력받는 필드
    @ApiProperty({ description: '사용자의 이름' })
    name?: string

    @IsOptional() // 선택적으로 입력받는 필드
    @IsInt({ message: '나이는 정수여야 합니다.' })
    @Min(1, { message: '나이는 1 이상이어야 합니다.' })
    @Max(120, { message: '나이는 120 이하이어야 합니다.' })
    @ApiProperty({ description: '사용자의 나이' })
    age?: number
}
