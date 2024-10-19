import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateProfileInput } from './create-profile.input';

export class UpdateProfileInput extends PartialType(
  OmitType(CreateProfileInput, ['role']),
) {}
