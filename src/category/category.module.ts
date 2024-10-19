import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProfileModule } from 'src/profile/profile.module';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';
import { Product } from 'src/product/entities/product.entity';

@Module({
  imports: [ProfileModule, TypeOrmModule.forFeature([Category, Product])],
  providers: [CategoryService],
  controllers: [CategoryController],
  exports: [CategoryService],
})
export class CategoryModule {}
