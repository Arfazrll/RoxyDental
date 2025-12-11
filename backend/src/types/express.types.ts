import { Request } from 'express';
import { UserRole } from '../../generated/prisma';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  fullName: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
  
}

