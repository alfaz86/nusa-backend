import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class S3Service {
  private s3: AWS.S3;
  private readonly bucketName: string;

  constructor(private configService: ConfigService) {
    // Konfigurasi S3 menggunakan AWS SDK
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_REGION'),
    });
    this.bucketName = this.configService.get('S3_BUCKET_NAME');
  }

  /**
   * Fungsi untuk meng-upload gambar ke S3
   * @param file Buffer atau Stream file gambar
   * @param fileName Nama file yang akan disimpan
   * @return URL dari gambar yang di-upload
   */
  async uploadFile(file: Buffer, fileName: string): Promise<string> {
    const key = `${uuid()}-${fileName}`; // Membuat nama file unik

    const params = {
      Bucket: this.bucketName,
      Key: key,
      Body: file,
      ACL: 'public-read', // Set gambar sebagai public-read
      ContentType: 'image/jpeg', // Tentukan tipe konten (bisa diubah sesuai jenis file)
    };

    try {
      const { Location } = await this.s3.upload(params).promise();
      return Location; // Mengembalikan URL gambar yang di-upload
    } catch (error) {
      throw new HttpException(
        'Error uploading file to S3',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const params = {
      Bucket: this.bucketName,
      Key: `images/${Date.now()}_${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      // ACL: 'public-read',
    };

    const result = await this.s3.upload(params).promise();
    return result.Location; // URL to the uploaded file
  }
}
