import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignUpUserDto } from './dto/signup-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async signUp(signUpUserDto: SignUpUserDto) {
    const { userId, studentId, password, name, phone, email, userGroup } =
      signUpUserDto;

    // 이미 가입된 학번이 있는지 확인
    const user = await this.usersRepository.findOne({ where: { studentId } });
    if (user) {
      return false;
    }

    // 기존에 가입한 정보가 없다면 회원가입 진행
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    await this.usersRepository.save({
      userId,
      studentId,
      password: hashedPassword,
      name,
      phone,
      email,
      userGroup,
    });

    return true;
  }

  findAll() {
    return `This action returns all users`;
  }

  async findByStudentId(studentId: number) {
    return this.usersRepository.findOne({
      where: { studentId },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
