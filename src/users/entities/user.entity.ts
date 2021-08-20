import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @Column()
  public id: string;

  @PrimaryGeneratedColumn()
  public sid: number;

  @Column()
  public ps: string;

  @Column()
  public name: string;

  @Column()
  public phone: string;

  @Column()
  public email: string;

  @Column()
  public userGroup: string;
}
