import { IsEmail, IsEnum, Length, MinLength } from 'class-validator';
import { MAX_NAME } from '../../common/constants';
import { ProfileRole } from '../common/profile-role.enum';

export class CreateProfileInput {
  @Length(1, MAX_NAME)
  declare readonly username: string;

  @IsEmail()
  declare readonly email: string;

  @MinLength(8)
  declare readonly password: string;

  @IsEnum(ProfileRole)
  declare readonly role: ProfileRole;
}
