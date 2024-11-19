import { Controller, Post, UseInterceptors, InternalServerErrorException, BadRequestException, UploadedFiles } from '@nestjs/common'
import { FileService } from './file.service'
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger'
import { FilesInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { FileuploadDto } from './dto/FileuploadDto.dto'
import { Public } from 'src/auth/public.decorator'
import * as iconv from 'iconv-lite'

@ApiTags('file')
@Controller('file')
export class FileController {
    constructor(private readonly fileService: FileService) {}

    @UseInterceptors(
        FilesInterceptor('files', 30, {
            // 파일 30개 까지 허용
            storage: diskStorage({
                destination: './uploads', // 파일을 저장할 경로 설정
                filename: (req, file, callback) => {
                    try {
                        console.log('file----->', file)
                        // 고유한 파일명을 생성하여 중복 방지
                        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
                        const ext = extname(file.originalname) // 파일의 확장자 추출

                        // 한글을 URL-safe 문자로 변환
                        // 한글 파일명을 안전하게 UTF-8로 변환
                        //const safeFilename = file.originalname // 파일명 인코딩
                        //const safeFilename = iconv.encode(file.originalname, 'utf-8').toString()
                        //const safeFilename = Buffer.from(file.originalname, 'utf-8').toString('base64')
                        // const safeFilename = ecodeURIComponent(file.originalname) // 파일명 인코딩
                        //const safeFilename = Buffer.from(file.originalname, 'latin1').toString('utf8') // 파일명 인코딩

                        const filename = `${file.fieldname}-${uniqueSuffix}${ext}` // 고유한 파일명 생성///
                        callback(null, filename) // 생성된 파일명을 콜백에 전달
                    } catch (error) {
                        // 파일명 생성 중 오류가 발생하면 InternalServerErrorException 반환
                        callback(new InternalServerErrorException('파일 이름 생성 중 오류가 발생했습니다.'), null)
                    }
                },
            }),
            limits: {
                fileSize: 5 * 1024 * 1024, // 파일 크기 제한 (5MB)
            },
            fileFilter: (req, file, callback) => {
                const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf', 'image/webp'] // 허용할 파일 형식 지정
                if (!allowedMimeTypes.includes(file.mimetype)) {
                    // 허용되지 않은 파일 형식이면 BadRequestException 반환
                    return callback(new BadRequestException(`허용되지 않는 파일 형식입니다: ${file.mimetype}`), false)
                }
                callback(null, true) // 허용된 파일 형식이면 업로드 진행
            },
        })
    )
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Upload multiple files', // Swagger에 파일 업로드 설명 추가
        type: FileuploadDto, // Swagger에 사용할 DTO 지정
    })
    @Post('/fileupload')
    @ApiOperation({
        summary: '단순 파일 업로드 테스트', // API 설명 요약
        description: '회원과는 상관없음', // API 상세 설명
    })
    @Public()
    async uploadFiles(@UploadedFiles() files) {
        console.log(`files -> `, files)
        if (!files || files.length === 0) {
            // 업로드된 파일이 없으면 BadRequestException 반환
            throw new BadRequestException('업로드된 파일이 없습니다.')
        }

        try {
            // 파일 배열을 서비스로 전달하여 추가 처리를 수행 (db에 저장하는 코드)
            //const uploadResult = await this.usersService.uploadFile(files)

            // 각 파일을 데이터베이스에 저장하기 위한 루프
            // for (const file of files) {
            //     const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8') // 파일명을 인코딩하여 DB에 저장

            //     // DB에 저장할 데이터 구조를 정의
            //     const uploadedFile = {
            //         originalName: originalName, // 인코딩된 파일명 저장
            //         storedName: file.filename, // 서버에 저장된 파일명 (인코딩하지 않음)
            //         path: `./uploads/${file.filename}`, // 파일 경로
            //     }

            //     // 데이터베이스에 저장
            //     //await this.uploadedFileRepository.save(uploadedFile)
            // }

            const all = files.map((file: any) => {
                return {
                    originName: Buffer.from(file.originalname, 'latin1').toString('utf8'),
                }
            })

            const res = await Promise.all(all)

            // input output 최적화되어있고
            // i/o에 최적화되어있다.
            // 이벤트단위로 실행/처리가 되는 언어.

            return files.map((file: Express.Multer.File) => {
                return {
                    originName: Buffer.from(file.originalname, 'latin1').toString('utf8'),
                }
            })

            return 'success' // 성공 시 업로드 결과 반환
        } catch (error) {
            // 서비스 호출 중 오류가 발생하면 InternalServerErrorException 반환
            console.error('파일 업로드 중 오류 발생:', error)
            throw new InternalServerErrorException('파일 업로드 중 오류가 발생했습니다.')
        }
    }
}
