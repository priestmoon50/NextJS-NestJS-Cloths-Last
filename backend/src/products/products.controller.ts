import { Controller, Get, Post, Body, Param, Patch, Delete, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express'; // تغییر به FilesInterceptor برای آپلود چند فایل
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
  @UseInterceptors(FilesInterceptor('image', 10, { storage })) // تغییر به FilesInterceptor برای آپلود چندین فایل
  async create(@UploadedFiles() files: Express.Multer.File[], @Body() productData: any): Promise<Product> {
    const imageUrls = files.map(file => `/uploads/${file.filename}`); // ایجاد آرایه‌ای از URL تصاویر
    const productWithImages = { ...productData, images: imageUrls }; // اضافه کردن URL تصاویر به محصول
    return this.productsService.create(productWithImages);
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
