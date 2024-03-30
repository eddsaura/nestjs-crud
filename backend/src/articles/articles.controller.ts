import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { ArticleDto } from './dto/articles.dto';
import { ArticlesService } from './articles.service';

@Controller('articles')
export class ArticlesController {
  constructor(private articleService: ArticlesService) {}
  @Post('/init')
  initArticle(@Body() initArticleDto: ArticleDto) {
    this.articleService.createInitialArticle(
      initArticleDto.uuid,
      initArticleDto.max_generations,
      initArticleDto.title,
    );

    return 'This is a single article: ' + initArticleDto.title;
  }

  @Post(':parent_id')
  createArticle(@Param('parent_id') parent_id: string) {
    return this.articleService
      .canCreateChildArticle(parent_id)
      .then((canCreate) => {
        console.log('canCreate', canCreate);
        if (!canCreate) {
          throw new HttpException(
            'Cannot create child article',
            HttpStatus.FORBIDDEN,
          );
        }
        return this.articleService.createChildrenArticle(parent_id);
      })
      .catch((err) => {
        console.log('err', err);
        throw new HttpException(
          'Cannot create child article, already fullfiled the max generations',
          HttpStatus.FORBIDDEN,
        );
      });
  }

  @Get(':id')
  getArticle() {
    return 'This is a single article';
  }

  // GET all articles
  @Get()
  getArticles() {
    return 'This is a list of articles';
  }

  @Patch(':id')
  editArticle() {
    return 'This is a single article';
  }

  @Delete('/article/:id')
  deleteArticle() {
    return 'This is a single article';
  }
}
