import {
  Column,
  Entity,
  ManyToOne,
  JoinTable,
  ManyToMany,
  RelationCount,
  BeforeInsert,
  AfterUpdate,
} from 'typeorm';
import { Base } from './base.entity';
import { UserEntity } from './user.entity';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';
import { Article } from '../interfaces/article.interface';

@Entity('articles')
export class ArticleEntity extends Base {
  @Column({ unique: true })
  slug: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  body: string;

  @Column('simple-array')
  tagList: string[];

  @JoinTable()
  @ManyToMany((type) => UserEntity, (user) => user.favorites, {
    eager: true,
  })
  favoritedBy: boolean;

  @RelationCount((article: ArticleEntity) => article.favoritedBy)
  @Column({ default: 0 })
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

  isFavoritedFor(user?: UserEntity): boolean {
    return Array.isArray(user?.favorites) && user
      ? user.favorites.includes(this)
      : false;
  }

  getArticle(user?: UserEntity): ArticleEntity {
    return {
      ...this,
      favorited: this.isFavoritedFor(user),
    };
  }

  generateSlug(title?: string) {
    return slugify(`${title ?? this.title}-${uuidv4()}`, {
      lower: true,
    });
  }

  @BeforeInsert()
  createSlug() {
    this.slug = this.generateSlug();
  }
}
