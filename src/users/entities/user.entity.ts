import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('User', { schema: 'pas' })
export class User {
  @ApiProperty({ example: 'codyung', description: '아이디' })
  @Column('char', { name: 'id', length: 50 })
  userId: string;

  @ApiProperty({ example: 201812345, description: '학번' })
  @PrimaryGeneratedColumn({ type: 'int', name: 'sid' })
  studentId: number;

  @ApiProperty({ example: '$code1234', description: '비밀번호' })
  @Column('char', { name: 'ps', length: 50 })
  password: string;

  @ApiProperty({ example: '이도제', description: '이름' })
  @Column('char', { name: 'name', length: 50 })
  name: string;

  @ApiProperty({ example: '010-5100-1436', description: '휴대폰' })
  @Column('char', { name: 'phone', length: 50 })
  phone: string;

  @ApiProperty({ example: 'cororing@pusan.ac.kr', description: '이메일' })
  @Column('char', { name: 'email', length: 50 })
  email: string;

  @ApiProperty({ example: 'student', description: '사용자 그룹' })
  // @Column('enum', { name: 'user_group', enum: ['student', 'teacher'] })
  @Column('varchar', { name: 'user_group', length: 15 })
  userGroup: string;

  @Column('datetime', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('datetime', {
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column('datetime', { name: 'deleted_at', nullable: true })
  deletedAt: Date;
}
