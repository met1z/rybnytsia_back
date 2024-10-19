import { IsBoolean, IsInt, IsOptional, IsString, Length } from 'class-validator';
import { MAX_NAME } from '../../common/constants';

export class CreateProductInput {
  @Length(1, MAX_NAME)
  declare readonly name: string;

  @Length(1, MAX_NAME)
  declare readonly price: string;

  @IsString()
  declare readonly imageUrl: string;

  @IsOptional()
  @IsBoolean()
  declare readonly published?: boolean;

  @IsInt()
  declare readonly categoryId: number;
}
