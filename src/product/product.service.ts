import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { S3Service } from '../s3/s3.service'; // Pastikan path-nya sesuai dengan lokasi s3.service.ts
import { CreateProductDto } from './product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly s3Service: S3Service,
  ) {}

  async findByStoreId(storeId: number): Promise<Product[]> {
    return this.productRepository.find({ where: { store: { id: storeId } } });
  }

  async createProduct(
    createProductDto: CreateProductDto,
    file: Express.Multer.File,
  ): Promise<Product> {
    // Upload image to S3
    const imageUrl = await this.s3Service.uploadImage(file);

    // Create product entity
    const product = this.productRepository.create({
      ...createProductDto,
      image: imageUrl,
    });

    // Menyimpan product ke database
    const savedProduct = await this.productRepository.save(product);

    // Save to database
    return savedProduct;
  }
}
