import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService, Product } from '../database/database.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SearchProductsDto } from './dto/search-products.dto';
import { PaginatedProductsDto, PaginationMeta } from './dto/paginated-products.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const db = this.databaseService.getDatabase();

    const newProduct: Product = {
      id: uuidv4(),
      ...createProductDto,
      createdAt: new Date(),
      updatedAt: new Date(),
      images: [],
    };

    db.get('products').push(newProduct).write();

    return newProduct;
  }

  async findAll(searchDto: SearchProductsDto = {}): Promise<PaginatedProductsDto> {
    const db = this.databaseService.getDatabase();
    let products = db.get('products').value();

    // Apply full-text search across multiple fields
    if (searchDto.search) {
      const searchTerm = searchDto.search.toLowerCase();
      products = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm)
      );
    }

    // Apply advanced search filters
    if (searchDto.category) {
      products = products.filter(
        (product) =>
          product.category.toLowerCase() === searchDto.category!.toLowerCase()
      );
    }

    if (searchDto.inStock !== undefined) {
      products = products.filter((product) => product.inStock === searchDto.inStock);
    }

    if (searchDto.minPrice !== undefined) {
      products = products.filter((product) => product.price >= searchDto.minPrice!);
    }

    if (searchDto.maxPrice !== undefined) {
      products = products.filter((product) => product.price <= searchDto.maxPrice!);
    }

    // Apply sorting
    if (searchDto.sortBy) {
      products = this.sortProducts(products, searchDto.sortBy, searchDto.sortOrder || 'asc');
    }

    // Calculate pagination
    const page = searchDto.page || 1;
    const limit = searchDto.limit || 10;
    const totalItems = products.length;
    const totalPages = Math.ceil(totalItems / limit);

    // If requested page exceeds totalPages (and there is at least one page), throw NotFoundException
    if (totalPages > 0 && page > totalPages) {
      throw new NotFoundException(`Page ${page} does not exist. There are only ${totalPages} page(s).`);
    }
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Apply pagination
    const paginatedProducts = products.slice(startIndex, endIndex);

    // Build pagination metadata
    const meta: PaginationMeta = {
      currentPage: page,
      itemsPerPage: limit,
      totalItems,
      totalPages,
      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages,
    };

    return {
      data: paginatedProducts,
      meta,
    };
  }

  private sortProducts(
    products: Product[],
    sortBy: 'name' | 'price' | 'category' | 'createdAt' | 'updatedAt',
    sortOrder: 'asc' | 'desc',
  ): Product[] {
    return products.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'name':
        case 'category':
          aValue = a[sortBy].toLowerCase();
          bValue = b[sortBy].toLowerCase();
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'createdAt':
        case 'updatedAt':
          aValue = new Date(a[sortBy]).getTime();
          bValue = new Date(b[sortBy]).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  async findOne(id: string): Promise<Product> {
    const db = this.databaseService.getDatabase();
    const product = db.get('products').find({ id }).value();

    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const db = this.databaseService.getDatabase();
    const product = db.get('products').find({ id }).value();

    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    const updatedProduct = {
      ...product,
      ...updateProductDto,
      updatedAt: new Date(),
    };

    db.get('products').find({ id }).assign(updatedProduct).write();

    return updatedProduct;
  }

  async remove(id: string): Promise<void> {
    const db = this.databaseService.getDatabase();
    const product = db.get('products').find({ id }).value();

    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    db.get('products').remove({ id }).write();
  }

  async addImages(id: string, imageFilenames: string[]): Promise<Product> {
    const db = this.databaseService.getDatabase();
    const product = db.get('products').find({ id }).value();

    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    const currentImages = product.images || [];
    const updatedImages = [...currentImages, ...imageFilenames];

    const updatedProduct = {
      ...product,
      images: updatedImages,
      updatedAt: new Date(),
    };

    db.get('products').find({ id }).assign(updatedProduct).write();

    return updatedProduct;
  }
}