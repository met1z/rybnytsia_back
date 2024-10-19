import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { MAX_NAME } from '../../common/constants';

export class CreateCategoryInput {
  @Length(1, MAX_NAME)
  declare readonly name: string;

  @IsOptional()
  @IsString()
  declare readonly imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  declare readonly published?: boolean;
}
