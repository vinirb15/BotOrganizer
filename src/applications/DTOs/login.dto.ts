import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class LoginDTO {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
