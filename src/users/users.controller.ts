import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserDto } from './dto/createUser.dto';
import { UserEntity } from './entity/user.entity';
import { LoginUserDto } from './dto/loginUser.dto';
import type { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createUser(
    @Body('user') createUserDto: createUserDto,
  ): Promise<UserEntity> {
    const user = await this.usersService.createUser(createUserDto);
    return this.usersService.buildUserResponse(user);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body('user') LoginUserDto: LoginUserDto): Promise<any> {
    const user = await this.usersService.login(LoginUserDto);
    return this.usersService.buildUserResponse(user);
  }

  @Get('user')
  async currentUser(@Req() request: Request): Promise<UserEntity> {
    console.log('request', request);
    return 'currenUser' as any;
  }
}
