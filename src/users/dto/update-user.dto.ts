import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { JoinUserDto } from './join-user.dto';

export class UpdateUserDto extends PartialType(JoinUserDto) {}
