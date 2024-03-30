import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class ArticleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  uuid: string;

  @IsNumber()
  @IsNotEmpty()
  max_generations: number;
}
