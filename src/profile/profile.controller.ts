import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Profile } from './entities/profile.entity';
import { CreateProfileInput } from './inputs/create-profile.input';
import { ProfileService } from './profile.service';
import { LoginInput } from './inputs/login.input';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { IsUserGuard } from 'src/auth/guards/is-user.guard';
import { HasRoles } from 'src/auth/decorators/has-roles.decorator';
import { ProfileRole } from './common/profile-role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UpdateProfileInput } from './inputs/update-profile.input';
import { UpdateProfileRoleInput } from './inputs/update-profile-role.input';

@Controller('profile')
export class ProfileController {
  constructor(private service: ProfileService) {}

  @Post('login')
  login(@Body() input: LoginInput): Promise<{ token: string; user?: Profile }> {
    return this.service.login(input);
  }

  @HasRoles(ProfileRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Pagination<Profile>> {
    limit = limit > 100 ? 100 : limit;

    return this.service.paginate({
      page: Number(page),
      limit: Number(limit),
    });
  }

  @UseGuards(JwtAuthGuard, IsUserGuard)
  @Get(':id')
  findOne(@Param() params): Promise<Profile> {
    return this.service.findOneOrFail(params.id);
  }

  @HasRoles(ProfileRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() user: CreateProfileInput): Promise<Profile> {
    return this.service.create(user);
  }

  @UseGuards(JwtAuthGuard, IsUserGuard)
  @Put(':id')
  updateOne(
    @Param('id') id: string,
    @Body() user: UpdateProfileInput,
  ): Promise<Profile> {
    return this.service.update(Number(id), user);
  }

  @HasRoles(ProfileRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id/role')
  updateRoleOfUser(
    @Param('id') id: string,
    @Body() user: UpdateProfileRoleInput,
  ): Promise<Profile> {
    return this.service.updateRoleOfUser(Number(id), user);
  }

  @UseGuards(JwtAuthGuard, IsUserGuard)
  @Delete(':id')
  deleteOne(@Param('id') id: string): Promise<boolean> {
    return this.service.remove(Number(id));
  }
}
