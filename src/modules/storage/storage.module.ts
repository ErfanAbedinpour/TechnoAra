import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { ConfigModule } from '@nestjs/config';
import storageConfig from './config/storage.config';
import { S3Storage } from './storages/s3-storage.service';

@Module({
  imports: [ConfigModule.forFeature(storageConfig)],
  providers: [StorageService, S3Storage],
  exports: [StorageService],
})
export class StorageModule { }
