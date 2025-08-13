import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService, Product } from '../database/database.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SearchProductsDto } from './dto/search-products.dto';

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

  async findAll(searchDto: SearchProductsDto = {}): Promise<Product[]> {
    const db = this.databaseService.getDatabase();
    let products = db.get('products').value();

    // Apply search filters
    if (searchDto.search) {
      const searchTerm = searchDto.search.toLowerCase();
      products = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm)
      );
    }

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

    return products;
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