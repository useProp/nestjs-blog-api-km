import { Entity, Column, BeforeInsert, JoinTable, ManyToMany } from 'typeorm';
import { IsEmail } from 'class-validator';
import { Exclude } from 'class-transformer';
import { Base } from './base.entity';
import * as bcrypt from 'bcryptjs';
import { Profile } from '../interfaces/profile.interface';

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

  async followTo(user: UserEntity): Promise<Profile> {
    user.followers.push(this);
    await user.save();
    return this.getProfile(user);
  }

  async unfollowFrom(user: UserEntity): Promise<Profile> {
    user.followers = user.followers.filter((follower) => follower !== this);
    await user.save();
    return this.getProfile(user);
  }

  getProfile(user: UserEntity): Profile {
    const { username, image, bio } = user.toJSON();
    const following = this.isFollowedTo(user);
    return { username, image, bio, following };
  }

  isFollowedTo(user: UserEntity | null): boolean {
    return user ? user.followers.includes(this) : false;
  }
}
