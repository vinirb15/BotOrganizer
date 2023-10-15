import { IsString, IsNotEmpty, IsEmail, IsPhoneNumber } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
