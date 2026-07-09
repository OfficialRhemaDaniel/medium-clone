import { Injectable, NestMiddleware } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { JWT_SECRET } from 'src/config';
import { ExpressRequest } from 'src/types/expressRequest.interface';
import { UsersService } from '../users.service';

interface JwtPayloadWithUser {
  id: number;
  username: string;
  email: string;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UsersService) {}

  async use(req: ExpressRequest, res: Response, next: NextFunction) {
    // console.log('authMiddleware', req.headers);
    if (!req.headers.authorization) {
      req.user = undefined;
      next();
      return;
    }

    const token = req.headers.authorization.split(' ')[1];

    try {
      const decode = verify(token, JWT_SECRET) as JwtPayloadWithUser;
      const user = await this.userService.findbyId(decode.id);
      req.user = user ?? undefined;
      next();
    } catch (err) {
      req.user = undefined;
      next();
    }
  }
}
