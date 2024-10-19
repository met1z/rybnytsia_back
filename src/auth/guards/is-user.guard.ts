import {
  Injectable,
  CanActivate,
  Inject,
  forwardRef,
  ExecutionContext,
} from '@nestjs/common';
import { ProfileRole } from 'src/profile/common/profile-role.enum';
import { Profile } from 'src/profile/entities/profile.entity';
import { ProfileService } from 'src/profile/profile.service';

@Injectable()
export class IsUserGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => ProfileService))
    private profileService: ProfileService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const params = request.params;
    const user: Profile = request.user;

    console.log(user)

    const userFromDb = await this.profileService.findOne(user.id);

    return userFromDb && (
      userFromDb.id === Number(params.id) ||
      userFromDb.role === ProfileRole.ADMIN
    );
  }
}
