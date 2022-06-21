import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleEntity } from '../entities/article.entity';
import { UserEntity } from '../entities/user.entity';
import { CreateArticleDTO } from '../dto/createArticle.dto';
import { UpdateArticleDTO } from '../dto/updateArticle.dto';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepo: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async getArticle(slug: string): Promise<ArticleEntity> {
    try {
      const article = await this.articleRepo.findOne({ where: { slug } });
      if (!article) {
        throw new NotFoundException('Article not found');
      }

      return article.getArticle();
    } catch ({ message, status }) {
      throw new HttpException(message, status);
    }
  }

  async createArticle(
    author: UserEntity,
    data: CreateArticleDTO,
  ): Promise<ArticleEntity> {
    try {
      const article = this.articleRepo.create(data);
      article.author = author;
      await article.save();
      return article.getArticle();
    } catch ({ message, status, code = null }) {
      throw new HttpException(message, status);
    }
  }

  async updateArticle(
    slug: string,
    editor: UserEntity,
    data: UpdateArticleDTO,
  ): Promise<ArticleEntity> {
    try {
      console.log('----------updateArticle----------');
      const article = await this.articleRepo.findOne({ where: { slug } });
      if (!article) {
        throw new NotFoundException('Article is not found');
      }

      if (article.author.id !== editor.id) {
        throw new UnauthorizedException('You can not edit this article');
      }

      const newSlug = article.generateSlug(data?.title ?? article.title);
      await this.articleRepo.update(
        { slug },
        {
          ...data,
          slug: newSlug,
        },
      );
      const updatedArticle = await this.articleRepo.findOne({
        where: { slug: newSlug },
      });
      console.log(
        '----------updatedArticle----------',
        updatedArticle.getArticle(editor),
      );
      return updatedArticle.getArticle(editor);
    } catch ({ message, status }) {
      throw new HttpException(message, status);
    }
  }

  async deleteArticle(slug: string, editor: UserEntity) {
    try {
      const article = await this.articleRepo.findOne({ where: { slug } });
      if (!article) {
        throw new NotFoundException('Article is not found');
      }

      if (article.author.id !== editor.id) {
        throw new UnauthorizedException('You can not edit this article');
      }

      await this.articleRepo.delete({ slug });
    } catch ({ message, status }) {
      throw new HttpException(message, status);
    }
  }
}
