import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createUserDto } from './dto/createUser.dto';
import { UserEntity } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from 'src/config';
import { LoginUserDto } from './dto/loginUser.dto';
import { compare } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: createUserDto) {
    const { email, username } = createUserDto;

    const credentialCheck = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });

    if (credentialCheck) {
      throw new ConflictException('Email or username is taken');
    }
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    // console.log('newUser', newUser);
    return await this.userRepository.save(newUser);
  }

  generateJwt(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      JWT_SECRET,
    );
  }

  buildUserResponse(user: UserEntity): any {
    const { password, ...userWithoutPassword } = user;

    return {
      user: {
        ...userWithoutPassword,
        token: this.generateJwt(user),
      },
    };
  }

  async findbyId(id: number): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async login(LoginUserDto: LoginUserDto): Promise<UserEntity> {
    const { email, password } = LoginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: {
        id: true,
        username: true,
        email: true,
        bio: true,
        image: true,
        password: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordCorrect = await compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
