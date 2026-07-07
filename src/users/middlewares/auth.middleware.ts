import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    console.log('authMiddleware', req.headers);
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }
    next();
  }
}
