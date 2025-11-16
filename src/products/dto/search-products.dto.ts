import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsNumber, IsInt, Min, Max, IsIn } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class SearchProductsDto {
  // Full-text search
  @ApiPropertyOptional({
    description: 'Full-text search across product name, description, and category',
    example: 'bluetooth',
  })
  @IsOptional()
  @IsString()
  search?: string;

  // Advanced search filters
  @ApiPropertyOptional({
    description: 'Filter by category (exact match)',
    example: 'Electronics',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'Filter by stock availability',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return undefined;
    return value === 'true' || value === true;
  })
  @IsBoolean()
  inStock?: boolean;

  @ApiPropertyOptional({
    description: 'Minimum price filter',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => (value === '' || value === null || value === undefined) ? undefined : Number(value))
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Maximum price filter',
    example: 200,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => (value === '' || value === null || value === undefined) ? undefined : Number(value))
  maxPrice?: number;

  // Pagination
  @ApiPropertyOptional({
    description: 'Page number (1-based)',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page (maximum 100)',
    example: 10,
    default: 10,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  // Sorting
  @ApiPropertyOptional({
    description: 'Field to sort by',
    example: 'price',
    enum: ['name', 'price', 'category', 'createdAt', 'updatedAt'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['name', 'price', 'category', 'createdAt', 'updatedAt'])
  sortBy?: 'name' | 'price' | 'category' | 'createdAt' | 'updatedAt';

  @ApiPropertyOptional({
    description: 'Sort order',
    example: 'asc',
    enum: ['asc', 'desc'],
    default: 'asc',
  })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'asc';
}