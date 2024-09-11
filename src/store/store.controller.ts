import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Store } from './store.entity';
import { StoreService } from './store.service';
import { CreateStoreDto } from './store.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('stores')
export class StoreController {
  constructor(
    private readonly storeService: StoreService
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('store_logo'))
  @UsePipes(new ValidationPipe())
  async create(
    @Body() createStoreDto: CreateStoreDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ): Promise<Store> {
    console.log(createStoreDto);
    console.log(file);
    console.log(req);

    const userId = req.user.id;

    // Define the upload directory
    const uploadDir = path.join(__dirname, '../../public/uploads/store/logo');
    const fileExtension = path.extname(file.originalname);
    const filename = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(uploadDir, filename);

    // Create upload directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Write file to the filesystem
    fs.writeFileSync(filePath, file.buffer);

    // Generate the file URL
    const fileUrl = `/uploads/store/logo/${filename}`;

    // Prepare data to be saved
    const storeData = {
      ...createStoreDto,
      store_logo: fileUrl,
      created_at: new Date(),
      updated_at: new Date(),
      users: [], // Default empty array for relations
      products: [], // Default empty array for relations
    };

    // Pass data to service
    return this.storeService.create(storeData, userId);
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    // Implement file upload logic here
    return 'uploaded_file_url';
  }
}
