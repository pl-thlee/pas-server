import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SignUpUserDto } from './dto/signup-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';

@ApiTags('Users')
@ApiResponse({ status: 200, description: '성공' })
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '회원가입' })
  @Post()
  async signUp(@Body() signUpUserDto: SignUpUserDto) {
    const user = this.usersService.findByStudentId(signUpUserDto.studentId);
    if (!user) {
      throw new NotFoundException();
    }

    const result = await this.usersService.signUp(signUpUserDto);
    if (result) {
      return '회원가입 성공';
    } else {
      throw new ForbiddenException();
    }
  }

  @ApiOperation({ summary: '로그인' })
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return loginUserDto;
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
