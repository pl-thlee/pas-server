import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @ApiProperty({ example: 'codyung', description: '아이디' })
  @Column({ type: 'char' })
  public id: string;

  @ApiProperty({ example: 201812345, description: '학번' })
  @PrimaryGeneratedColumn({ type: 'int' })
  public sid: number;

  @ApiProperty({ example: '$code1234', description: '비밀번호' })
  @Column({ type: 'char' })
  public ps: string;

  @ApiProperty({ example: '이도제', description: '이름' })
  @Column({ type: 'char' })
  public name: string;

  @ApiProperty({ example: '010-5100-1436', description: '휴대폰' })
  @Column({ type: 'char' })
  public phone: string;

  @ApiProperty({ example: 'cororing@pusan.ac.kr', description: '이메일' })
  @Column({ type: 'char' })
  public email: string;

  @ApiProperty({ example: 'student', description: '사용자 그룹' })
  @Column({ type: 'varchar' })
  public userGroup: string;
}
