import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryInput } from './inputs/create-category.input';
import { UpdateCategoryInput } from './inputs/update-category.input';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>,
  ) {}

  async findOneOrFail(id: number): Promise<Category> {
    return await this.repository.findOneByOrFail({ id });
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Category>> {
    return await paginate<Category>(this.repository, options);
  }

  async paginatePublished(
    options: IPaginationOptions,
  ): Promise<Pagination<Category>> {
    return await paginate<Category>(this.repository, options, {
      where: { published: true },
    });
  }

  async create(input: CreateCategoryInput): Promise<Category> {
    return await this.repository.save(input);
  }

  async update(id: number, user: UpdateCategoryInput): Promise<Category> {
    await this.repository.update(id, user);
    return await this.findOneOrFail(id);
  }

  async remove(id: number): Promise<boolean> {
    const res = await this.repository.delete(id);
    return !!res.affected;
  }
}
