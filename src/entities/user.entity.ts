import { Entity, Column, BeforeInsert } from 'typeorm';
import { IsEmail } from 'class-validator';
import {classToPlain, Exclude, instanceToPlain} from 'class-transformer';
import { Base } from './base.entity';
import * as bcrypt from 'bcryptjs';

@Entity('users')
export class UserEntity extends Base {
  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ default: '' })
  bio: string;

  @Column({ default: null, nullable: true })
  image: string | null;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
