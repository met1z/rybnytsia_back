import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProfileModule } from 'src/profile/profile.module';
import { ProductController } from './product.controller';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';

@Module({
  imports: [ProfileModule, TypeOrmModule.forFeature([Product])],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class CategoryModule {}
