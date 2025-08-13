import { Injectable, OnModuleInit } from '@nestjs/common';
import lowdb from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import { join } from 'path';
import { ApiProperty } from '@nestjs/swagger';

export class Product {
  @ApiProperty({ description: 'Product ID', example: '1' })
  id: string;

  @ApiProperty({ description: 'Product name', example: 'Wireless Bluetooth Headphones' })
  name: string;

  @ApiProperty({ description: 'Product description', example: 'High-quality wireless headphones with noise cancellation' })
  description: string;

  @ApiProperty({ description: 'Product price', example: 199.99 })
  price: number;

  @ApiProperty({ description: 'Product category', example: 'Electronics' })
  category: string;

  @ApiProperty({ description: 'Product availability status', example: true })
  inStock: boolean;

  @ApiProperty({ description: 'Creation date', example: '2025-08-14T00:08:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date', example: '2025-08-14T00:08:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ description: 'Product images', example: ['image1.jpg', 'image2.png'], type: [String] })
  images?: string[];
}

interface DatabaseData {
  products: Product[];
}

@Injectable()
export class DatabaseService implements OnModuleInit {
  private db: any;

  constructor() {
    const file = join(process.cwd(), 'db', 'data', 'db.json');
    const adapter = new FileSync(file);
    this.db = lowdb(adapter);
    this.db.defaults({ products: [] }).write();
  }

  async onModuleInit() {
    // Initialize with default data if empty
    if (this.db.get('products').value().length === 0) {
      this.initializeData();
    }
  }

  initializeData() {
    const sampleProducts: Product[] = [
      {
        id: '1',
        name: 'Wireless Bluetooth Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 199.99,
        category: 'Electronics',
        inStock: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        images: [],
      },
      {
        id: '2',
        name: 'Organic Coffee Beans',
        description: 'Premium organic coffee beans from Colombia',
        price: 24.99,
        category: 'Food & Beverages',
        inStock: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        images: [],
      },
      {
        id: '3',
        name: 'Yoga Mat',
        description: 'Eco-friendly yoga mat with superior grip',
        price: 49.99,
        category: 'Sports & Fitness',
        inStock: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        images: [],
      },
      {
        id: '4',
        name: 'LED Desk Lamp',
        description: 'Adjustable LED desk lamp with USB charging port',
        price: 79.99,
        category: 'Home & Office',
        inStock: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        images: [],
      },
      {
        id: '5',
        name: 'Running Shoes',
        description: 'Lightweight running shoes with advanced cushioning',
        price: 129.99,
        category: 'Sports & Fitness',
        inStock: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        images: [],
      },
    ];

    this.db.set('products', sampleProducts).write();
  }

  getDatabase(): any {
    return this.db;
  }

  writeDatabase(): void {
    this.db.write();
  }
}