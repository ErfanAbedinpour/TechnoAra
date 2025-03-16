import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { ConfigModule } from '@nestjs/config';
import storageConfig from './config/storage.config';
import { Storage } from './storages/storage.abstract';
import { LocalFileStorage } from './storages/local-storage.service';

@Module({
  imports: [ConfigModule.forFeature(storageConfig)],
  providers: [StorageService, {
    provide: Storage,
    useClass: LocalFileStorage
  }],
  exports: [StorageService],
})
export class StorageModule { }
