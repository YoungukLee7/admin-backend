import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiProduces, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { UserResponseDto } from './dto/user-response.dto'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { Public } from 'src/auth/public.decorator'

@ApiTags('User') // 스웨거에 묶여 있을 그룹명이다
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @ApiOperation({
        summary: '사용자 추가',
        description: '사용자의 이메일, 이름, 나이를 작성하여 추가한다.',
    }) // api 설명
    // @ApiQuery({ name: 'email', required: true, description: '사용자 이메일을 입력해주세요.' }) // URL의 ? key, value 형식으로 받을 경우 사용
    // @ApiParam({ name: 'email', required: true, description: '사용자 이메일을 입력해주세요.' }) // URL의 :id 형식으로 받을 경우 사용
    @ApiResponse({
        status: 200,
        description: '게시물이 성공적으로 생성되었습니다.',
        schema: {
            example: {
                id: 1,
                title: 'NestJS와 Swagger를 사용하여 문서화하기',
                content: '이 게시물은 Swagger 문서를 만들기 위한 예제입니다.',
            },
        },
    })
    @ApiResponse({
        status: 500,
        description: '잘못된 요청입니다. title과 content는 필수입니다.',
        schema: {
            example: {
                message: ['title should not be empty', 'content should not be empty'],
                statusCode: 500,
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: '게시물이 성공적으로 생성되었습니다.',
        type: UserResponseDto,
    }) // 응답 데이터가 복잡할 때 응답모델을 만들어 보여주는 법
    //@ApiResponse({ status: 201, description: '게시물이 성공적으로 생성되었습니다.' })
    // @ApiBody({
    //     type: CreateUserDto,
    //     description: '사용자 추가 시 예시 데이터',
    //     examples: {
    //         example1: {
    //             summary: '회원정보',
    //             value: {
    //                 name: '홍길동',
    //                 age: '12',
    //                 email: 'test@example.com',
    //             },
    //         },
    //         example2: {
    //             summary: '회원정보2',
    //             value: {
    //                 name: '이순신',
    //                 age: '13',
    //                 email: 'test2@example.com',
    //             },
    //         },
    //     },
    // }) // body에 들어갈 예시 데이터들 정의
    @ApiConsumes('application/json') // 요청의 콘텐츠타입을 지정 (기본값이 application/json이여서 생략가능)
    @ApiProduces('application/json') // 응답의 콘텐츠타입을 지정 (기본값이 application/json이여서 생략가능)
    @ApiBearerAuth() // Bearer 토큰 인증 헤더 추가
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto)
    }

    @Get(':email')
    @ApiOperation({ summary: '사용자 조회', description: '이메일로 사용자를 조회한다.' })
    findOne(@Param('email') email: string) {
        return this.userService.findOne(email)
    }

    //@UseGuards(JwtAuthGuard)
    @Public()
    @Get('list')
    @ApiOperation({ summary: '사용자 목록 조회', description: '사용자 목록을 조회한다.' })
    findAll() {
        return this.userService.findAll()
    }

    @Put()
    @ApiOperation({ summary: '사용자 정보 수정', description: '사용자 정보를 수정한다.' })
    // @ApiQuery({ name: 'id', required: true, description: '사용자 아이디는 필수 파라미터입니다.' })
    // @ApiQuery({ name: 'email', required: true, description: '사용자 이메일을 입력해주세요.' })
    // @ApiQuery({ name: 'name', required: false, description: '사용자 이름을 입력해주세요.' })
    // @ApiQuery({ name: 'age', required: false, description: '사용자 나이를 입력해주세요.' })
    update(@Query('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(id, updateUserDto)
    }

    @Delete()
    @ApiQuery({ name: 'id', required: true, description: '사용자 아이디는 필수 파라미터입니다.' })
    @ApiOperation({ summary: '사용자 정보 삭제', description: '사용자 정보를 삭제한다. (논리삭제)' })
    remove(@Query('id') id: string) {
        return this.userService.remove(id)
    }
}
