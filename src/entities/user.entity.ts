import { Entity, Column, BeforeInsert, JoinTable, ManyToMany } from 'typeorm';
import { IsEmail } from 'class-validator';
import { Exclude } from 'class-transformer';
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

  @JoinTable()
  @ManyToMany((type) => UserEntity, (user) => user.followed)
  followers: UserEntity[];

  @ManyToMany((type) => UserEntity, (user) => user.followers)
  followed: UserEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  isFollowedTo(user: UserEntity) {
    const isFollowing = this.followers.includes(user);
    const profile: any = this.toJSON();
    delete profile.followers;
    return { ...profile, following: isFollowing };
  }
}
