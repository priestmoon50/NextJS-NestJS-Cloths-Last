import { Controller, Post, Get, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@Controller('gallery') // کنترلر برای مسیر /gallery
export class GalleryController {
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './gallery', // ذخیره فایل‌ها در پوشه gallery
        filename: (req, file, cb) => {
          const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueSuffix); // نام یکتا برای هر فایل
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    const fileUrl = `/gallery/${file.filename}`; // آدرس URL فایل
    return { fileUrl }; // بازگشت URL برای ذخیره در دیتابیس یا نمایش در فرانت‌اند
  }

  // اضافه کردن مسیر GET برای بازگرداندن لیست تصاویر
  @Get()
  async getAllImages() {
    const directoryPath = path.join(__dirname, '../gallery');
    
    // خواندن لیست فایل‌ها از پوشه gallery
    const files = await new Promise<string[]>((resolve, reject) => {
      fs.readdir(directoryPath, (err, files) => {
        if (err) {
          reject(err);
        }
        resolve(files);
      });
    });

    // ایجاد URL کامل برای هر فایل
    const imageUrls = files.map(file => `http://localhost:3001/gallery/${file}`);
    return imageUrls; // بازگشت لیست URL‌های تصاویر به فرانت‌اند
  }
}
