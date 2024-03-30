import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

const ENCRYPTION_KEY = 'superlujo_is_the_only_way';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async createInitialArticle(
    uuid: string,
    maxGenerations: number,
    title: string,
  ) {
    return this.prisma.article.create({
      data: {
        id: uuid,
        generation: 0,
        max_generations: maxGenerations,
        title,
      },
    });
  }

  async canCreateChildArticle(parentId: string) {
    const parentArticle = await this.prisma.article.findUnique({
      where: {
        id: parentId,
      },
    });

    if (!parentArticle) {
      return false;
    }

    const childrenCount = await this.prisma.article.count({
      where: {
        parent_id: parentId,
      },
    });

    console.log('childrenCount', childrenCount);
    console.log('parentArticle.max_generations', parentArticle.max_generations);
    console.log(parentArticle.max_generations - parentArticle.generation);

    if (
      childrenCount >=
      parentArticle.max_generations - parentArticle.generation
    ) {
      return false;
    }

    return true;
  }

  async createChildrenArticle(parentId: string) {
    const parentArticle = await this.prisma.article.findUnique({
      where: {
        id: parentId,
      },
    });

    return this.prisma.article.create({
      data: {
        parent_id: parentId,
        generation: parentArticle.generation + 1,
        max_generations: parentArticle.max_generations,
        title: 'Child Article',
      },
    });
  }

  async getAllArticles() {
    return this.prisma.article.findMany();
  }
}
