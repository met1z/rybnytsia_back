import { IsEmail, MinLength } from 'class-validator';

export class LoginInput {

  @IsEmail()
  declare readonly email: string;

  @MinLength(8)
  declare readonly password: string;
}
