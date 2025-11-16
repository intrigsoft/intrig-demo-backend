import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../database/database.service';

export class PaginationMeta {
  @ApiProperty({ description: 'Current page number', example: 1 })
  currentPage: number;

  @ApiProperty({ description: 'Number of items per page', example: 10 })
  itemsPerPage: number;

  @ApiProperty({ description: 'Total number of items', example: 50 })
  totalItems: number;

  @ApiProperty({ description: 'Total number of pages', example: 5 })
  totalPages: number;

  @ApiProperty({ description: 'Has previous page', example: false })
  hasPreviousPage: boolean;

  @ApiProperty({ description: 'Has next page', example: true })
  hasNextPage: boolean;
}

export class PaginatedProductsDto {
  @ApiProperty({
    description: 'Array of products for current page',
    type: [Product],
  })
  data: Product[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: PaginationMeta,
  })
  meta: PaginationMeta;
}
