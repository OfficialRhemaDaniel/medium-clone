import { Request } from 'express';
import { UserEntity } from 'src/users/entity/user.entity';

export interface ExpressRequest extends Request {
  user?: UserEntity;
}
