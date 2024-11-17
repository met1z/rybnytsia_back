import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { CreateProfileInput } from './inputs/create-profile.input';
import { UpdateProfileInput } from './inputs/update-profile.input';
import { UpdateProfileRoleInput } from './inputs/update-profile-role.input';
import { LoginInput } from './inputs/login.input';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly repository: Repository<Profile>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  async findOne(id: number): Promise<Profile | undefined> {
    return await this.repository.findOneBy({ id });
  }

  async findOneOrFail(id: number): Promise<Profile> {
    return await this.repository.findOneByOrFail({ id });
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Profile>> {
    return await paginate<Profile>(this.repository, options);
  }

  async create(input: CreateProfileInput): Promise<Profile> {
    const newProfile = {
      ...input,
      password: await this.authService.hashPassword(input.password),
    };
    const { id } = await this.repository.save(newProfile);
    return this.findOneOrFail(id);
  }

  async update(id: number, user: UpdateProfileInput): Promise<Profile> {
    if (user.password) {
      Object.assign(user, {
        password: await this.authService.hashPassword(user.password),
      });
    }

    await this.repository.update(id, user);
    return await this.findOneOrFail(id);
  }

  async updateRoleOfUser(
    id: number,
    user: UpdateProfileRoleInput,
  ): Promise<Profile> {
    await this.repository.update(id, user);
    return await this.findOneOrFail(id);
  }

  async remove(id: number): Promise<boolean> {
    const res = await this.repository.delete(id);
    return !!res.affected;
  }

  async login(input: LoginInput): Promise<{ token: string; user?: Profile }> {
    const valid = await this.validateUser(input.email, input.password);
    if (valid) {
      const user = await this.repository.findOneByOrFail({
        email: input.email,
      });
      return { token: await this.authService.generateJWT(user), user };
    } else {
      return { token: 'Wrong Credentials', user: undefined };
    }
  }

  async validateUser(email: string, password: string): Promise<boolean> {
    const user = await this.repository.findOne({
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
        role: true,
      },
      where: { email },
    });

    return !!(await this.authService.comparePasswords(password, user.password));
  }
}
