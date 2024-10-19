import { IsEmail, Length } from 'class-validator';
import { MAX_NAME } from 'src/common/constants';

export class ContactFormInput {
  @IsEmail()
  declare readonly email: string;

  @Length(1, MAX_NAME)
  declare readonly name: string;

  @Length(1, 512)
  declare readonly msg: string;
}
