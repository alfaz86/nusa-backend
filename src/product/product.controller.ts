import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './product.dto';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  
  @Get()
  getAllProducts() {
    return [
      {
        id: 1,
        name: 'Laptop ASUS Vivobook Go 14',
        price: 5599000,
        path: '/uploads/products/ASUS Vivobook Go 14.png',
      },
      {
        id: 2,
        name: 'Laptop HP Stream 14',
        price: 4364687,
        path: '/uploads/products/HP Stream 14.jpg',
      },
      {
        id: 3,
        name: 'Laptop Lenovo V14-ADA-82C600ERID',
        price: 5100000,
        path: '/uploads/products/Lenovo V14-ADA-82C600ERID.jpg',
      },
      {
        id: 4,
        name: 'Rexus Keyboard Gaming Mechanical Legionare MX5.2 TKL',
        price: 399000,
        path: '/uploads/products/Rexus Keyboard Gaming Mechanical Legionare MX5.2 TKL.png',
      },
      {
        id: 5,
        name: 'Keyboard Mekanik Ajazz AK820 Pro Ungu',
        price: 1025261,
        path: '/uploads/products/Keyboard Mekanik Ajazz AK820 Pro Ungu.png',
      },
      {
        id: 6,
        name: 'Fantech ATOM MIZU SERIES Keyboard Mechanical Gaming ATOM 63 81 96 Hotswappable 3 Pin',
        price: 209000,
        path: '/uploads/products/Fantech ATOM MIZU SERIES Keyboard Mechanical Gaming ATOM 63 81 96 Hotswappable 3 Pin.jpeg',
      },
    ];
  }

  @Get('store/:storeId')
  async getProductsByStore(@Param('storeId') storeId: number) {
    return this.productService.findByStoreId(storeId);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productService.createProduct(createProductDto, file);
  }
}
