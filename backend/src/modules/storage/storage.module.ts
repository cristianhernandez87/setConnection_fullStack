import { Module } from '@nestjs/common';
import { S3StorageProvider } from './storage.service';
import { STORAGE_PROVIDER_TOKEN } from './storage.interface';

@Module({
  providers: [
    {
      provide: STORAGE_PROVIDER_TOKEN,
      useClass: S3StorageProvider, // Aquí podrías cambiar a LocalStorageProvider si quisieras
    },
  ],
  exports: [STORAGE_PROVIDER_TOKEN], // Lo exportamos para que otros módulos lo usen
})
export class StorageModule {}
