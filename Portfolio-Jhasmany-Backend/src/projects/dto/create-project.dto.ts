import { IsString, IsArray, IsOptional, IsUrl, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Project title',
    example: 'Portfolio Website',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Project description',
    example: 'A modern portfolio website built with Next.js and NestJS',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Project detailed content',
    example: 'This project showcases...',
    required: false,
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    description: 'Technologies used',
    example: ['Next.js', 'NestJS', 'PostgreSQL', 'Docker'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  technologies?: string[];

  @ApiProperty({
    description: 'Project image URL',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiProperty({
    description: 'Demo URL',
    example: 'https://portfolio-demo.com',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  demoUrl?: string;

  @ApiProperty({
    description: 'GitHub repository URL',
    example: 'https://github.com/user/project',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  githubUrl?: string;

  @ApiProperty({
    description: 'Project order for display',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiProperty({
    description: 'Whether the project is published',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}