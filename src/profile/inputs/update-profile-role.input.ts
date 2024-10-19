import { IsEnum } from 'class-validator';
import { ProfileRole } from '../common/profile-role.enum';

export class UpdateProfileRoleInput {
  @IsEnum(ProfileRole)
  declare readonly role: ProfileRole;
}
