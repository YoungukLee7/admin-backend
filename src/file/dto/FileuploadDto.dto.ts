import { ApiProperty } from '@nestjs/swagger'

export class FileuploadDto {
    @ApiProperty({
        type: 'string',
        format: 'binary',
        isArray: true, // 여러 개의 파일을 허용
        description: 'List of files to upload',
    })
    files: any[]
}
