import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  RelationCount,
} from 'typeorm';
import { Base } from './base.entity';
import { UserEntity } from './user.entity';

@Entity('articles')
export class ArticleEntity extends Base {
  @Column()
  slug: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  body: string;

  @Column('simple-array')
  tagList: string[];

  @JoinColumn()
  @ManyToMany((type) => UserEntity, (user) => user.favorites, {
    eager: true,
  })
  favoritedBy: boolean;

  @RelationCount((article: ArticleEntity) => article.favoritedBy)
  favoritesCount: number;

  @ManyToOne((type) => UserEntity, (user) => user.articles, {
    eager: true,
  })
  author: UserEntity;

  async addToFavorites(user: UserEntity): Promise<UserEntity> {
    user.favorites.push(this);
    await user.save();
    return user;
  }

  async removeFromFavorites(user: UserEntity): Promise<UserEntity> {
    user.favorites = user.favorites.filter((article) => article !== this);
    await user.save();
    return user;
  }

  isFavoritedFor(user: UserEntity): boolean {
    return user ? user.favorites.includes(this) : false;
  }
}
