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
import { CategoryService } from './category.service';
import { ProfileRole } from '../profile/common/profile-role.enum';
import { Category } from './entities/category.entity';
import { CreateCategoryInput } from './inputs/create-category.input';
import { UpdateCategoryInput } from './inputs/update-category.input';

@Controller('category')
export class CategoryController {
  constructor(private service: CategoryService) {}

  @Get('published')
  findAllPublished(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Pagination<Category>> {
    limit = limit > 100 ? 100 : limit;

    return this.service.paginatePublished({
      page: Number(page),
      limit: Number(limit),
    });
  }

  @HasRoles(ProfileRole.ADMIN, ProfileRole.EDITOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Pagination<Category>> {
    limit = limit > 100 ? 100 : limit;

    return this.service.paginate({
      page: Number(page),
      limit: Number(limit),
    });
  }

  @HasRoles(ProfileRole.ADMIN, ProfileRole.EDITOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() user: CreateCategoryInput): Promise<Category> {
    return this.service.create(user);
  }

  @HasRoles(ProfileRole.ADMIN, ProfileRole.EDITOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  updateOne(
    @Param('id') id: string,
    @Body() user: UpdateCategoryInput,
  ): Promise<Category> {
    return this.service.update(Number(id), user);
  }

  @HasRoles(ProfileRole.ADMIN, ProfileRole.EDITOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  deleteOne(@Param('id') id: string): Promise<boolean> {
    return this.service.remove(Number(id));
  }
}
