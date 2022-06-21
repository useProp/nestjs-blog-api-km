import {
  Controller,
  Param,
  Get,
  UseGuards,
  Post,
  Body,
  Put,
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';
import { GetUser } from '../decorators/getUser.decorator';
import { UserEntity } from '../entities/user.entity';
import { CreateArticleDTO } from '../dto/createArticle.dto';
import { ArticleEntity } from '../entities/article.entity';
import { UpdateArticleDTO } from '../dto/updateArticle.dto';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('/:slug')
  async getArticle(@Param('slug') slug: string) {
    const article = await this.articleService.getArticle(slug);
    return {
      article: {
        ...article,
      },
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createArticle(
    @GetUser() author: UserEntity,
    @Body(ValidationPipe) { article: data }: { article: CreateArticleDTO },
  ) {
    const article = await this.articleService.createArticle(author, data);
    return {
      article: {
        ...article,
      },
    };
  }

  @Put('/:slug')
  @UseGuards(JwtAuthGuard)
  async updateArticle(
    @GetUser() editor: UserEntity,
    @Param('slug') slug: string,
    @Body(ValidationPipe) { article: data }: { article: UpdateArticleDTO },
  ) {
    const article = await this.articleService.updateArticle(slug, editor, data);
    console.log('----------article----------', article);
    return {
      article: {
        ...article,
      },
    };
  }

  @Delete('/:slug')
  @UseGuards(JwtAuthGuard)
  async deleteArticle(
    @Param('slug') slug: string,
    @GetUser() editor: UserEntity,
  ): Promise<void> {
    return this.articleService.deleteArticle(slug, editor);
  }
}
