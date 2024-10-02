import { Controller, Get, Post, Body, Param, Patch, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ProductsService } from './products.service';
import { Product } from './product.schema';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

// تنظیم مسیر ذخیره‌سازی فایل و تغییر نام فایل
const storage = diskStorage({
  destination: './uploads', // مسیر ذخیره‌سازی فایل
  filename: (req, file, cb) => {
    const uniqueSuffix = uuidv4() + extname(file.originalname); // اضافه کردن پسوند و یک ID یکتا
    cb(null, uniqueSuffix);
  },
});

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', { storage })) // آپلود فایل با Multer
  async create(@UploadedFile() file: Express.Multer.File, @Body() productData: any): Promise<Product> {
    const imageUrl = `/uploads/${file.filename}`; // مسیر فایل ذخیره‌شده
    const productWithImage = { ...productData, images: [imageUrl] }; // اضافه کردن URL تصویر به محصول
    return this.productsService.create(productWithImage);
  }

  @Get()
  async findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() productData: Partial<Product>): Promise<Product> {
    return this.productsService.update(id, productData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Product> {
    return this.productsService.remove(id);
  }
}
