import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class SearchProductsDto {
  @ApiPropertyOptional({
    description: 'Search term for product name or description',
    example: 'bluetooth',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by category',
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
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  inStock?: boolean;

  @ApiPropertyOptional({
    description: 'Minimum price filter',
    example: 10,
  })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Maximum price filter',
    example: 200,
  })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  maxPrice?: number;
}