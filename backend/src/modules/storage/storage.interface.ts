import { Express } from 'express';
import 'multer';

export interface IStorageProvider {
  uploadFile(file: Express.Multer.File, bucket: string): Promise<string>;
}

// Este token nos servirá para la Inyección de Dependencias
export const STORAGE_PROVIDER_TOKEN = 'STORAGE_PROVIDER_TOKEN';
