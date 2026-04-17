import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { IStorageProvider } from './storage.interface';

@Injectable()
export class S3StorageProvider implements IStorageProvider {
  private s3Client: S3Client;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
        region: 'us-east-1',
        endpoint: `http://${this.configService.get<string>('S3_ENDPOINT')}:${this.configService.get<string>('S3_PORT')}`,
        credentials: {
            accessKeyId: this.configService.get<string>('S3_ACCESS_KEY') ?? '',
            secretAccessKey: this.configService.get<string>('S3_SECRET_KEY') ?? '',
        },
        forcePathStyle: true,
    });
  }

  async uploadFile(file: Express.Multer.File, bucket: string): Promise<string> {
    const fileKey = `${Date.now()}-${file.originalname}`;
    
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return fileKey; // Devolvemos el nombre/ruta para guardarlo en la DB después
  }
}