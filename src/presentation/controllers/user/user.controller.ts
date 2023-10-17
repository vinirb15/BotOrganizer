import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { UserService } from '@services/user.service';
import { CreateUserDTO } from 'src/applications/DTOs/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:userId')
  async findById(@Param('userId', ParseIntPipe) userId: number) {
    return this.userService.findById(userId);
  }

  @Get('/findByEmail')
  async findByEmail(@Param('userEmail') userEmail: string) {
    return this.userService.findByEmail(userEmail);
  }

  @Post()
  async createUser(@Body() body: CreateUserDTO) {
    return this.userService.createUser(body);
  }

  @Delete('/:userId')
  async deleteUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.userService.deleteUser(userId);
  }
}
