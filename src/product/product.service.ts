import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './inputs/create-product.input';
import { UpdateProductInput } from './inputs/update-product.input';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
  ) {}

  async paginate(options: IPaginationOptions): Promise<Pagination<Product>> {
    return await paginate<Product>(this.repository, options, {
      relations: ['category'],
    });
  }

  async paginatePublished(
    options: IPaginationOptions,
  ): Promise<Pagination<Product>> {
    return await paginate<Product>(this.repository, options, {
      where: { published: true },
    });
  }

  async paginateByCategory(
    options: IPaginationOptions,
    categoryId: number,
  ): Promise<Pagination<Product>> {
    return await paginate<Product>(this.repository, options, {
      where: { categoryId, published: true },
    });
  }

  async findOneOrFail(id: number): Promise<Product> {
    return await this.repository.findOneOrFail({
      where: { id },
      relations: ['category'],
    });
  }

  async create(input: CreateProductInput): Promise<Product> {
    const res = await this.repository.save(input);
    return await this.findOneOrFail(res.id);
  }

  async update(id: number, user: UpdateProductInput): Promise<Product> {
    await this.repository.update(id, user);
    return await this.findOneOrFail(id);
  }

  async remove(id: number): Promise<boolean> {
    const res = await this.repository.delete(id);
    return !!res.affected;
  }
}
