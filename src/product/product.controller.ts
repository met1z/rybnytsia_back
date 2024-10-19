import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { HasRoles } from 'src/auth/decorators/has-roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ProfileRole } from '../profile/common/profile-role.enum';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './inputs/create-product.input';
import { UpdateProductInput } from './inputs/update-product.input';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private service: ProductService) {}

  @Get('published')
  findAllPublished(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Pagination<Product>> {
    limit = limit > 100 ? 100 : limit;

    return this.service.paginatePublished({
      page: Number(page),
      limit: Number(limit),
    });
  }

  @Get('published/:id')
  findAllPublishedByCategory(
    @Param('id') id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Pagination<Product>> {
    limit = limit > 100 ? 100 : limit;

    return this.service.paginateByCategory(
      {
        page: Number(page),
        limit: Number(limit),
      },
      Number(id),
    );
  }

  @HasRoles(ProfileRole.ADMIN, ProfileRole.EDITOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Pagination<Product>> {
    limit = limit > 100 ? 100 : limit;

    return this.service.paginate({
      page: Number(page),
      limit: Number(limit),
    });
  }

  @HasRoles(ProfileRole.ADMIN, ProfileRole.EDITOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() user: CreateProductInput): Promise<Product> {
    return this.service.create(user);
  }

  @HasRoles(ProfileRole.ADMIN, ProfileRole.EDITOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  updateOne(
    @Param('id') id: string,
    @Body() user: UpdateProductInput,
  ): Promise<Product> {
    return this.service.update(Number(id), user);
  }

  @HasRoles(ProfileRole.ADMIN, ProfileRole.EDITOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  deleteOne(@Param('id') id: string): Promise<boolean> {
    return this.service.remove(Number(id));
  }
}
