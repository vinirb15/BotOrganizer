import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { UserService } from '@services/user.service';
import { CreateUserDTO } from 'src/applications/DTOs/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:userId')
  async findNextEvents(@Param('userId', ParseIntPipe) userId: number) {
    return this.userService.findById(userId);
  }

  @Post()
  async createUser(@Body() body: CreateUserDTO) {
    return this.userService.createUser(body);
  }
}
